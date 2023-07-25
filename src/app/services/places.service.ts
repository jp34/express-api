import axios from "axios";
import Env from "../../config/env";
import logger from "../../config/logger";
import { findUserInterests } from "./users.service";
import { findTagRefs } from "./tags.service";
import { NonExistentResourceError } from "../../domain/error";

export type PlacesSearchOptions = {
    query?: string,
    categories?: string,
    ll?: string,
    radius?: string,
    exclude_all_chains?: string,
    limit?: string
};

/**
 * This method will return a list of places based on user preferences for a given location
 * @param latitude 
 * @param longitude 
 * @returns 
 */
export const nearbySuggestionSearch = async (actor: string, latitude: number, longitude: number) => {
    const interests = await findUserInterests(actor, actor);
    if (!interests) throw new NonExistentResourceError("user:interests", actor);
    const refs = await findTagRefs(actor, interests);
    const categories = refs.join(",");
    return await placesSearch({
        ll: `${latitude},${longitude}`,
        categories,
        radius: '4800',
        exclude_all_chains: 'true',
        limit: '15'
    });
}

export const placesSearch = async (options: PlacesSearchOptions) => {
    try {
        const search = new URLSearchParams(options);
        const response = await axios.get(`https://api.foursquare.com/v3/places/search?${search}`, {
            headers: {
                Authorization: Env.FOURSQUARE_KEY,
                Accept: 'application/json'
            }}
        );
        return response.data.results;
    } catch (err: any) {
        logger.warn("Failed to perform placesSearch");
        logger.error(err);
    }
}
