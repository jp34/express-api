import { Response, NextFunction } from "express";
import { refreshAccessToken } from "../services/token.service";
import {
    AuthenticationPayload,
    AuthenticationRequest,
    RefreshRequest,
    RegistrationPayload,
    RegistrationRequest
} from "../../domain/auth";
import { InvalidInputError, InvalidOperationError } from "../../domain/error";
import logger from "../../config/logger";
import { register, authenticate } from "../services/auth.service";

export default class AuthController {

    /**
     * POST /auth/login
     * This route allows a user to authenticate themselves with email and password
     * @param request Http request
     * @param response Http response
     * @param next Next middleware function
     */
    public login = async (request: AuthenticationRequest, response: Response, next: NextFunction) => {
        try {
            if (!request.ip) throw new InvalidOperationError("Request has not been verified yet");
            const payload: AuthenticationPayload = request.body.data;
            if (!payload.identifier) throw new InvalidInputError('identifier');
            if (!payload.password) throw new InvalidInputError('password');
            const data = await authenticate(request.ip, payload);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * POST /auth/signup
     * This route allows a user to create a new account
     * @param request Http request
     * @param response Http response
     * @param next Next middleware function
     */
    public signup = async (request: RegistrationRequest, response: Response, next: NextFunction) => {
        try {
            if (!request.ip) throw new InvalidOperationError("Request has not been verified yet");
            const payload: RegistrationPayload = request.body.data;
            if (!payload) throw new InvalidInputError('data');
            const data = await register(request.ip, payload);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * POST /auth/refresh
     * This route allows a user to refresh their access token using a refresh token
     * @param request Http request
     * @param response Http response
     * @param next Next middleware function
     */
    public refresh = async (request: RefreshRequest, response: Response, next: NextFunction) => {
        try {
            if (!request.ip) throw new InvalidOperationError("Request has not been verified yet");
            const data = request.body.data;
            if (!data.refresh) throw new InvalidInputError('refresh');
            const token = refreshAccessToken(data.refresh);
            response.status(200).json({ data: { tokens: { access: token, refresh: data.refresh }}});
            next();
        } catch (err: any) {
            return next(err);
        }
    }
}
