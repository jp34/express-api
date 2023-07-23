import { Request, Response, NextFunction } from "express";
import {
    findAccounts,
    findAccount,
    deleteAccount,
    updateAccountEmail,
    updateAccountPassword,
    updateAccountVerified,
    updateAccountLocked
} from "../services/accounts.service";
import { InvalidInputError, InvalidOperationError } from "../../domain/entity/error";
import logger from "../../config/logger";

export default class AccountsController {

    /**
     * GET /accounts
     * This route returns an array of account objects
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getMany = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
        let offset;
        let limit;
        if (request.query.offset) offset = +request.query.offset;
        if (request.query.limit) limit = +request.query.limit;
        findAccounts(request.user.uid, offset, limit).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    /**
     * GET /accounts/:uid
     * This route returns a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
        const uid = request.params.uid;
        if (!uid) throw new InvalidInputError("uid");
        findAccount(request.user.uid, uid).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    /**
     * PUT /accounts/:uid
     * This route updates a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public update = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
        const uid: string = request.params.uid;
        if (!uid) throw new InvalidInputError("uid");
        try {
            const actor = request.user.uid;
            if (request.query.email) await updateAccountEmail(actor, uid, request.query.email.toString());
            if (request.query.password) await updateAccountPassword(actor, uid, request.query.password.toString());
            if (request.query.name) await updateAccountEmail(actor, uid, request.query.name.toString());
            if (request.query.phone) await updateAccountEmail(actor, uid, request.query.phone.toString());
            if (request.query.birthday) await updateAccountEmail(actor, uid, request.query.birthday.toString());
            if (request.query.verified) await updateAccountVerified(actor, uid, (request.query.verified === 'true'));
            if (request.query.locked) await updateAccountLocked(actor, uid, (request.query.locked === 'true'));
            else throw new InvalidInputError("No update parameter provided");
            response.status(200).json({ data: true });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * DELETE /accounts/:uid
     * This route deletes a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public delete = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
        const uid: string = request.params.uid;
        if (!uid) throw new InvalidInputError("Id");
        deleteAccount(request.user.uid, uid).then((deleted) => {
            response.status(200).json({ data: { deleted }});
            next();
        }).catch(next);
    }
}
