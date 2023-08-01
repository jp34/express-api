import { Request, Response, NextFunction } from "express";
import {
    deleteUser,
    findUser,
    findUsers,
    updateUsername,
    findUserInterests,
    addUserInterests,
    createUser,
    findUserFriends,
    findUserGroups,
    findUserInbox
} from "../services/user.service";
import { CreateUserPayload } from "../../domain/dto/user.dto";
import { InvalidInputError, InvalidOperationError } from "../../domain/error";

export default class UsersController {

    // ---- User --------

    /**
     * POST /users/:id
     * @param request 
     * @param response 
     * @param next 
     */
    public create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const payload: CreateUserPayload = request.body.data;
            if (!payload) throw new InvalidInputError("data");
            const data = await createUser(request.user.id, id, payload);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }        
    }

    /**
     * GET /users
     * @param request 
     * @param response 
     * @param next 
     */
    public getMany = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            let offset;
            let limit;
            if (request.query.offset) offset = +request.query.offset;
            if (request.query.limit) limit = +request.query.limit;
            const data = await findUsers(request.user.id, { }, offset, limit);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * GET /users/:id
     * @param request 
     * @param response 
     * @param next 
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const data = await findUser(request.user.id, { _id: id });
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * PUT /users/:id
     * @param request 
     * @param response 
     * @param next 
     */
    public update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const actor = request.user.id;
            if (request.query.username) await updateUsername(actor, { _id: id }, request.query.username.toString());
            response.status(200).json({ data: true });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * DELETE /users/:id
     * @param request 
     * @param response 
     * @param next 
     */
    public delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const deleted = await deleteUser(request.user.id, { _id: id });
            response.status(200).json({ data: { deleted }});
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // ---- User Interests --------

    /**
     * GET /users/:id/interests
     * @param request 
     * @param response 
     * @param next 
     */
    public getInterests = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const data = await findUserInterests(request.user.id, { _id: id })
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * PUT /users/:id/interests
     * @param request 
     * @param response 
     * @param next 
     */
    public addInterests = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            const payload: string[] = request.body.data;
            if (!id) throw new InvalidInputError("id");
            if (!payload) throw new InvalidInputError("data");
            const data = await addUserInterests(request.user.id, { _id: id }, payload);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // ---- User Friends --------

    /**
     * GET /users/:id/friends
     * @param request 
     * @param response 
     * @param next 
     */
    public getFriends = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const data = await findUserFriends(request.user.id, { _id: id });
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // ---- User Groups --------

    /**
     * GET /users/:id/groups
     * @param request 
     * @param response 
     * @param next 
     */
    public getGroups = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const data = await findUserGroups(request.user.id, { _id: id });
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // ---- User Inbox --------

    /**
     * GET /users/:id/inbox
     * @param request 
     * @param response 
     * @param next 
     */
    public getInbox = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const id: string = request.params.id;
            if (!id) throw new InvalidInputError("id");
            const data = await findUserInbox(request.user.id, { _id: id });
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }
}
