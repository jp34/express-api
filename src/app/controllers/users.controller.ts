import { Request, Response, NextFunction } from "express";
import {
    deleteUser,
    findUser,
    findUsers,
    updateUsername,
    findUserInterests,
    addUserInterests,
    updateOnlineStatus,
    updateActiveStatus,
    createUser,
    findUserFriends,
    findUserGroups,
    findUserInbox
} from "../services/users.service";
import { CreateUserPayload } from "../../domain/entity/user";
import { InvalidInputError, InvalidOperationError } from "../../domain/error";
import logger from "../../config/logger";

export default class UsersController {

    // ---- User ------------

    /**
     * POST /users/:uid
     * @param request 
     * @param response 
     * @param next 
     */
    public create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const payload: CreateUserPayload = request.body.data;
            if (!payload) throw new InvalidInputError("data");
            const data = await createUser(request.user.uid, uid, payload);
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
            const data = await findUsers(request.user.uid, offset, limit);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * GET /users/:uid
     * @param request 
     * @param response 
     * @param next 
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const data = await findUser(request.user.uid, uid);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * PUT /users/:uid
     * @param request 
     * @param response 
     * @param next 
     */
    public update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const actor = request.user.uid;
            if (request.query.username) await updateUsername(actor, uid, request.query.username.toString());
            if (request.query.online) await updateOnlineStatus(actor, uid, (request.query.online === 'true'));
            if (request.query.active) await updateActiveStatus(actor, uid, (request.query.active === 'true'));
            response.status(200).json({ data: true });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * DELETE /users/:uid
     * @param request 
     * @param response 
     * @param next 
     */
    public delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const deleted = await deleteUser(request.user.uid, uid);
            response.status(200).json({ data: { deleted }});
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // ---- User Interests ------------

    /**
     * GET /users/:uid/interests
     * @param request 
     * @param response 
     * @param next 
     */
    public getInterests = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const data = await findUserInterests(request.user.uid, uid)
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * PUT /users/:uid/interests
     * @param request 
     * @param response 
     * @param next 
     */
    public addInterests = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            const payload: string[] = request.body.data;
            if (!uid) throw new InvalidInputError("uid");
            if (!payload) throw new InvalidInputError("data");
            const data = await addUserInterests(request.user.uid, uid, payload);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // ---- User Friends ------------

    /**
     * GET /users/:uid/friends
     * @param request 
     * @param response 
     * @param next 
     */
    public getFriends = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const data = await findUserFriends(request.user.uid, uid);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // ---- User Groups ------------

    /**
     * GET /users/:uid/groups
     * @param request 
     * @param response 
     * @param next 
     */
    public getGroups = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const data = await findUserGroups(request.user.uid, uid);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // ---- User Inbox ------------

    /**
     * GET /users/:uid/inbox
     * @param request 
     * @param response 
     * @param next 
     */
    public getInbox = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const uid: string = request.params.uid;
            if (!uid) throw new InvalidInputError("uid");
            const data = await findUserInbox(request.user.uid, uid);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * PUT /users/:uid/inbox
     * @param request 
     * @param response 
     * @param next 
     */
    public updateInbox = async (request: Request, response: Response, next: NextFunction) => {
        const note = request.query.note;
        const action = request.query.action;
        if (!note) throw new InvalidInputError("query:note");
        if (!action) throw new InvalidInputError("query:action");
        
    }
}
