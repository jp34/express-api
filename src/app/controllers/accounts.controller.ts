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
} from "../services/account.service";
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
            const data = await findAccounts(request.user.id, {}, offset, limit);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * GET /accounts/:id
     * This route returns a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const data = await findAccount(request.user.id, { _id: id });
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * PUT /accounts/:id
     * This route updates a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const actor = request.user.id;
            if (request.query.email) await updateAccountEmail(actor, { _id: id }, request.query.email.toString());
            if (request.query.password) await updateAccountPassword(actor, { _id: id }, request.query.password.toString());
            if (request.query.name) await updateAccountName(actor, { _id: id }, request.query.name.toString());
            if (request.query.phone) await updateAccountPhone(actor, { _id: id }, request.query.phone.toString());
            if (request.query.birthday) await updateAccountBirthday(actor, { _id: id }, request.query.birthday.toString());
            response.status(200).json({ data: true });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * DELETE /accounts/:id
     * This route deletes a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            if (!id) throw new InvalidInputError("Id");
            const deleted = await deleteAccount(request.user.id, { _id: id });
            response.status(200).json({ data: { deleted }});
            next();
        } catch (err: any) {
            next(err);
        }
    }
}
