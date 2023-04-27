import axios from "axios";
import { ConfigurationError } from "../models/error"
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

export const placesSearchByIp = async (lat: number, lng: number, query: string, key: string) => {
	try {
		const search = new URLSearchParams({
			ll: `${lat},${lng}`,
			query: query,
			open_now: 'true',
			sort: 'DISTANCE'
		  });
		const url = `https://api.foursquare.com/v3/places/search?${search}`;
		const response = await axios.get(url, {
			headers: {
				Accept: 'application/json',
				Authorization: key,
			}
		});
		if (response.status != 200) throw Error('Places search responded with error');
		return response.data;
	} catch (err) {
		console.error(err);
	}
}
