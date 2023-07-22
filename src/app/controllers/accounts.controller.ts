import { Request, Response, NextFunction } from "express";
import { UpdateAccountRequest, UpdateAccountPayload } from "../../domain/models/account";
import { findAccounts, findAccount, updateAccount, deleteAccount } from "../services/accounts.service";
import { InvalidInputError, InvalidOperationError } from "../../domain/models/error";

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
    public update = async (request: UpdateAccountRequest, response: Response, next: NextFunction) => {
        if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
        const uid = request.params.uid;
        const data: UpdateAccountPayload = request.body.data;
        if (!uid) throw new InvalidInputError('uid');
        if (!data) throw new InvalidInputError('data');
        updateAccount(request.user.uid, uid, data).then(data => {
            response.status(200).json({ data });
            next();
        }).catch(next);
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
