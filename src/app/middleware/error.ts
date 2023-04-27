import { Request, Response, NextFunction } from "express";
import { InvalidInputError, ServerError, UnauthorizedError } from "../../models/error";
import logger from "../../config/logger";

export const handle = async (err: Error, request: Request, response: Response, next: NextFunction) => {
    logger.error(`${err.name} ocurred: ${err.message}`);
    if (err instanceof InvalidInputError) {
        response.status(400).json({ status: "error", error: err.message });
    } else if (err instanceof UnauthorizedError) {
        response.status(406).json({ status: "error", error: err.message });
    } else if (err instanceof ServerError) {
        response.status(500).json({ status: "error", error: "Server error"});
    }
    next();
}
