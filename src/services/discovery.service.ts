import { placesSearchByIp } from "sn-core"
import { ConfigurationError } from "../config/error"
import logger from "../config/logger"

const API_KEY = process.env.FOURSQUARE_API_KEY

export const discoverNearby = async (lat: number, lng: number, query: string) => {
    try {
        if (!API_KEY) throw new ConfigurationError("Missing environment variable: FOURSQUARE_API_KEY");
        const result = await placesSearchByIp(lat, lng, query, API_KEY);
        return result;
    } catch (err: any) {
        logger.warn("Request to Foursquare Places API resulted in error: ");
        logger.error(err);
        return false;
    }
}
