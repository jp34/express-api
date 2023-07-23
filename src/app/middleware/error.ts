import { Request, Response, NextFunction } from "express";
import { InvalidInputError, ServerError, UnauthorizedError } from "../../domain/entity/error";
import logger from "../../config/logger";

export const handle = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof InvalidInputError) {
        res.status(400).json({ error: error.message });
    } else if (error instanceof UnauthorizedError) {
        res.status(406).json({ error: error.message });
        logger.info('Unauthorized access attempted', {
            reason: error.message,
            ip: req.ip,
            timestamp: Date.now(),
        });
    } else if (error instanceof ServerError) {
        res.status(500).json({ error: "Server error" });
    }
    next();
}
