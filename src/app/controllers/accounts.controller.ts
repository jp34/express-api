import { Request, Response, NextFunction } from "express";
import {
    findAccounts,
    findAccount,
    deleteAccount,
    updateAccountEmail,
    updateAccountPassword,
    updateAccountName,
    updateAccountPhone,
    updateAccountBirthday
} from "../services/accounts.service";
import { InvalidInputError, InvalidOperationError } from "../../domain/error";

export default class AccountsController {

    /**
     * GET /accounts
     * This route returns an array of account objects
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getMany = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            let offset;
            let limit;
            if (request.query.offset) offset = +request.query.offset;
            if (request.query.limit) limit = +request.query.limit;
            const data = await findAccounts(request.user.uid, offset, limit);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * GET /accounts/:uid
     * This route returns a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const data = await findAccount(request.user.uid, uid);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * PUT /accounts/:uid
     * This route updates a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const actor = request.user.uid;
            if (request.query.email) await updateAccountEmail(actor, uid, request.query.email.toString());
            if (request.query.password) await updateAccountPassword(actor, uid, request.query.password.toString());
            if (request.query.name) await updateAccountName(actor, uid, request.query.name.toString());
            if (request.query.phone) await updateAccountPhone(actor, uid, request.query.phone.toString());
            if (request.query.birthday) await updateAccountBirthday(actor, uid, request.query.birthday.toString());
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
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            if (!uid) throw new InvalidInputError("Id");
            const deleted = await deleteAccount(request.user.uid, uid);
            response.status(200).json({ data: { deleted }});
            next();
        } catch (err: any) {
            next(err);
        }
    }
}
