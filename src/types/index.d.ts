import "express";

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>;
            ip?: string;
        }
    }
}
