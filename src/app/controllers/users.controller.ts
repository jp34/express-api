import { Request, Response, NextFunction } from "express";
import { createUser, deleteUser, findUserByUid, findUsers, updateUsername } from "../services/users.service";
import { CreateUserPayload, CreateUserRequest, UpdateUserPayload, UpdateUserRequest } from "../models/user";
import { InvalidInputError } from "../models/error";

export default class UsersController {

    public create = async (request: CreateUserRequest, response: Response, next: NextFunction) => {
        const data: CreateUserPayload = request.body.data;
        if (!data) throw new InvalidInputError('data');
        createUser(data).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    public getMany = async (request: Request, response: Response, next: NextFunction) => {
        let offset;
        let limit;
        if (request.query.offset) offset = +request.query.offset;
        if (request.query.limit) limit = +request.query.limit;
        findUsers(offset, limit).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        const uid = request.params.uid;
        if (!uid) throw new InvalidInputError("uid");
        findUserByUid(uid).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    public update = async (request: UpdateUserRequest, response: Response, next: NextFunction) => {
        const uid: string = request.params.uid;
        if (!uid) throw new InvalidInputError("uid");
        const data: UpdateUserPayload = request.body.data;
        if (!data) throw new InvalidInputError("data");
        updateUsername(uid, data.username).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    public delete = async (request: Request, response: Response, next: NextFunction) => {
        const uid: string = request.params.uid;
        if (!uid) throw new InvalidInputError("uid");
        deleteUser(uid).then((deleted) => {
            response.status(200).json({ data: { deleted }});
            next();
        }).catch(next);
    }
}
