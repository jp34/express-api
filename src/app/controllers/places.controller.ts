import { Request, Response, NextFunction } from "express";
import { nearbySuggestionSearch } from "../services/places.service";
import { InvalidInputError, InvalidOperationError } from "../../domain/error";

export default class PlacesController {

    /**
     * GET /places/search
     * @param request 
     * @param response 
     * @param next 
     */
    public search = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            
            
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * GET /places/nearby
     * @param request 
     * @param response 
     * @param next 
     */
    public nearby = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const latitude = request.query.latitude;
            const longitude = request.query.longitude;
            if (!latitude) throw new InvalidInputError("query:latitude");
            if (!longitude) throw new InvalidInputError("query:longitude");
            const data = await nearbySuggestionSearch(request.user.uid, parseFloat(latitude.toString()), parseFloat(longitude.toString()));
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }
}
