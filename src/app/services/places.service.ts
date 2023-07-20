import axios from "axios";
import { ConfigurationError, ServerError } from "../models/error";

const API_FOURSQUARE_KEY = process.env.API_FOURSQUARE_KEY ?? undefined;

export type PlacesSearchOptions = {
    query?: string,
    categories?: string,
    geo: {
        latitude: string,
        longitude: string
    },
    radius: number,
};

export const placesSearch = async (options: PlacesSearchOptions) => {
    if (!API_FOURSQUARE_KEY) throw new ConfigurationError('Environment variable API_FOURSQUARE_KEY is missing or invalid');
    axios.get(`https://api.foursquare.com/v3/places/search?${options.toString()}`, {
        headers: {
            Authorization: API_FOURSQUARE_KEY,
            Accept: 'application/json'
        }}
    ).then((response) => {
        return response.data.results;
    }).catch((err: any) => {
        throw new ServerError(err);
    });
}
