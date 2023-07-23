import { Request, Response, NextFunction } from "express";
import {
    createTag,
    findTags,
    findTag,
    deleteTag,
    updateTagLabel,
    updateTagParent,
    updateTagRef,
} from "../services/tags.service";
import {
    CreateTagRequest,
    CreateTagPayload,
} from "../../domain/entity/tag";
import { InvalidInputError, InvalidOperationError } from "../../domain/entity/error";

export default class TagsController {

    /**
     * POST /tags
     * This route creates a new tag object
     * @param request Http request object
     * @param response Http response objet
     * @param next Next middleware function
     */
    public create = async (request: CreateTagRequest, response: Response, next: NextFunction) => {
        if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
        const data: CreateTagPayload = request.body.data;
        if (!data) throw new InvalidInputError('data');
        createTag(request.user.uid, data).then(data => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    /**
     * GET /tags
     * This route returns an array of existing tags
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
        findTags(request.user.uid, offset, limit).then(async data => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    /**
     * GET /tags/:name
     * This route returns a single tag object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
        if (!request.params.name) throw new InvalidInputError("Id");
        findTag(request.user.uid, request.params.name).then(data => {
            response.status(200).json({ data });
            next();
        }).catch(next);
    }

    /**
     * PUT /tags/:name
     * This route updates a tag by its identifier
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public update = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
        const name: string = request.params.name;
        if (!name) throw new InvalidInputError("name");
        try {
            const actor = request.user.uid;
            if (request.query.label) await updateTagLabel(actor, name, request.query.label.toString());
            if (request.query.parent) await updateTagParent(actor, name, request.query.parent.toString());
            if (request.query.ref) await updateTagRef(actor, name, request.query.ref.toString());
            else throw new InvalidInputError("No update parameter provided");
            response.status(200).json({ data: true });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * DELETE /tags/:name
     * This route deletes a tag by its identifier
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public delete = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
        if (!request.params.name) throw new InvalidInputError("Id");
        deleteTag(request.user.uid, request.params.name).then((deleted) => {
            response.status(200).json({ data: { deleted }});
            next();
        }).catch(next);
    }
}
