import { Request, Response, NextFunction } from "express";
import {
    deleteUser,
    findUserByUid,
    findUsers,
    updateUsername,
    getUserInterests,
    addUserInterests,
    removeUserInterests
} from "../services/users.service";
import { UpdateUserPayload, UpdateUserRequest } from "../models/user";
import { InvalidInputError } from "../models/error";

export default class UsersController {

    /**
     * GET /users
     * @param request 
     * @param response 
     * @param next 
     */
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

    /**
     * GET /users/:uid
     * @param request 
     * @param response 
     * @param next 
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        const uid = request.params.uid;
        if (!uid) throw new InvalidInputError("uid");
        findUserByUid(uid).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    /**
     * PUT /users/:uid
     * @param request 
     * @param response 
     * @param next 
     */
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

    /**
     * DELETE /users/:uid
     * @param request 
     * @param response 
     * @param next 
     */
    public delete = async (request: Request, response: Response, next: NextFunction) => {
        const uid: string = request.params.uid;
        if (!uid) throw new InvalidInputError("uid");
        deleteUser(uid).then((deleted) => {
            response.status(200).json({ data: { deleted }});
            next();
        }).catch(next);
    }

    /**
     * GET /users/:uid/interests
     * @param request 
     * @param response 
     * @param next 
     */
    public getInterests = async (request: Request, response: Response, next: NextFunction) => {
        const uid: string = request.params.uid;
        if (!uid) throw new InvalidInputError("uid");
        getUserInterests(uid).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    /**
     * PUT /users/:uid/interests
     * @param request 
     * @param response 
     * @param next 
     */
    public addInterests = async (request: Request, response: Response, next: NextFunction) => {
        const uid: string = request.params.uid;
        const data: string[] = request.body.data;
        if (!uid) throw new InvalidInputError("uid");
        if (!data) throw new InvalidInputError("data");
        addUserInterests(uid, data).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    /**
     * DELETE /users/:uid/interests
     * @param request 
     * @param response 
     * @param next 
     */
    public removeInterests = async (request: Request, response: Response, next: NextFunction) => {
        const uid: string = request.params.uid;
        const data: string[] = request.body.data;
        if (!uid) throw new InvalidInputError("uid");
        if (!data) throw new InvalidInputError("data");
        removeUserInterests(uid, data).then((data) => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }
}
