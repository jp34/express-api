import { Request, Response, NextFunction } from "express";
import {
    createTag,
    findTags,
    findTag,
    deleteTag,
    updateTagLabel,
    updateTagParent,
    updateTagRef,
} from "../services/tag.service";
import {
    CreateTagRequest,
    CreateTagPayload,
} from "../../domain/dto/tag.dto";
import { InvalidInputError, InvalidOperationError } from "../../domain/error";

export default class TagsController {

    /**
     * POST /tags
     * This route creates a new tag object
     * @param request Http request object
     * @param response Http response objet
     * @param next Next middleware function
     */
    public create = async (request: CreateTagRequest, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const payload: CreateTagPayload = request.body.data;
            if (!payload) throw new InvalidInputError('data');
            const data = await createTag(request.user.id, payload);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * GET /tags
     * This route returns an array of existing tags
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
            const data = await findTags(request.user.id, {}, offset, limit);
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * GET /tags/:name
     * This route returns a single tag object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            if (!request.params.name) throw new InvalidInputError("Id");
            const data = await findTag(request.user.id, { name: request.params.name });
            response.status(200).json({ data });
            next();
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * PUT /tags/:name
     * This route updates a tag by its identifier
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            const name: string = request.params.name;
            if (!name) throw new InvalidInputError("name");
            const actor = request.user.id;
            if (request.query.label) await updateTagLabel(actor, { name }, request.query.label.toString());
            if (request.query.parent) await updateTagParent(actor, { name }, request.query.parent.toString());
            if (request.query.ref) await updateTagRef(actor, { name }, request.query.ref.toString());
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
        try {
            if (!request.user) throw new InvalidOperationError("Request does not have an associated user");
            if (!request.params.name) throw new InvalidInputError("Id");
            const deleted = await deleteTag(request.user.id, { name: request.params.name });
            response.status(200).json({ data: { deleted }});
            next();
        } catch (err: any) {
            next(err);
        }
    }
}
