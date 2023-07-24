import { Request, Response, NextFunction } from "express";
import { InvalidInputError, InvalidOperationError, UnauthorizedError } from "../../domain/error";
import logger from "../../config/logger";

export const handle = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof UnauthorizedError) {
        res.status(406).json({ error: error.message });
        logger.warn('Unauthorized access attempted', {
            cause: error.message,
            ip: req.ip,
            timestamp: Date.now()
        });
    } else if (error instanceof InvalidInputError) {
        res.status(400).json({ error: error.message });
        logger.warn('Invalid input provided', {
            cause: error.message,
            ip: req.ip,
            timestamp: Date.now()
        });
    } else if (error instanceof InvalidOperationError) {
        res.status(400).json({ error: error.message });
        logger.warn('Invalid operation attempted', {
            cause: error.message,
            ip: req.ip,
            timestamp: Date.now()
        });
    } else {
        res.status(400).json({ error: error.message });
        logger.warn('Unknown error occured', {
            cause: error.message,
            ip: req.ip,
            timestamp: Date.now()
        });
    }
    next();
}
