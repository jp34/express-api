import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { UpdateAccountRequest } from "../../config/io";
import { UpdateAccountPayload } from "sn-core";
import { findAccounts, findAccountById, updateAccount, deleteAccount } from "../../services/accounts.service";
import { InvalidInputError } from "../../config/error";

export default class AccountsController {

    /**
     * GET /accounts
     * This route returns an array of account objects
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getMany = async (request: Request, response: Response, next: NextFunction) => {
        let offset;
        let limit;
        if (request.query.offset) offset = +request.query.offset;
        if (request.query.limit) limit = +request.query.limit;
        findAccounts(offset, limit).then(data => {
            response.status(200).json({ status: "success", data: data });
            next();
        }).catch(next);
    }

    /**
     * GET /accounts/:id
     * This route returns a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.params.id) throw new InvalidInputError("Id");
        findAccountById(request.params.id).then(data => {
            response.status(200).json({ status: "success", data: data });
            next();
        }).catch(next);
    }

    /**
     * PUT /accounts/:id
     * This route updates a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public update = async (request: UpdateAccountRequest, response: Response, next: NextFunction) => {
        const id = request.params.id;
        const data: UpdateAccountPayload = request.body.data;
        if (!id) throw new InvalidInputError('id');
        if (!data) throw new InvalidInputError('data');
        updateAccount(id, data).then(data => {
            response.status(200).json({ status: "success", data: data });
            next();
        }).catch(next);
    }

    /**
     * DELETE /accounts/:id
     * This route deletes a single account object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public delete = async (request: Request, response: Response, next: NextFunction) => {
        const id: string = request.params.id;
        if (!isValidObjectId(id)) throw new InvalidInputError("Id");
        deleteAccount(id).then(data => {
            response.status(200).json({ status: "success", data: data });
            next();
        }).catch(next);
    }
}
