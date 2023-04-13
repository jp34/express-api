import { Response, NextFunction } from "express";
import { discoverNearby } from "../../services/discovery.service";
import { DiscoveryRequest } from "../../config/io";
import logger from "../../config/logger";

export default class DiscoveryController {

    /**
     * Get /discovery
     * This route returns a list of recommended locations based on the given location,
     * and user interests
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public get = async (request: DiscoveryRequest, response: Response, next: NextFunction) => {
        try {
            const query = request.query;
            const searchResult = await discoverNearby(query.lat, query.lng, query.search);
        } catch (err: any) {
            logger.warn(err);
        }
    }
}
