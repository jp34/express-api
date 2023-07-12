import { Request, Response, NextFunction } from "express";
import {
    createTag,
    findTags,
    findTag,
    updateTag,
    deleteTag,
} from "../services/tags.service";
import { CreateTagRequest, UpdateTagRequest, CreateTagPayload, UpdateTagPayload } from "../models/io";
import { InvalidInputError } from "../models/error";

export default class TagsController {

    /**
     * POST /tags
     * This route creates a new tag object
     * @param request Http request object
     * @param response Http response objet
     * @param next Next middleware function
     */
    public create = async (request: CreateTagRequest, response: Response, next: NextFunction) => {
        const data: CreateTagPayload = request.body.data;
        if (!data) throw new InvalidInputError('data');
        createTag(data).then(data => {
            response.status(200).json({ data });
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
        let offset;
        let limit;
        if (request.query.offset) offset = +request.query.offset;
        if (request.query.limit) limit = +request.query.limit;
        findTags(offset, limit).then(async data => {
            response.status(200).json({ data });
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
        if (!request.params.name) throw new InvalidInputError("Id");
        findTag(request.params.name).then(data => {
            response.status(200).json({ data });
        }).catch(next);
    }

    /**
     * PUT /tags/:name
     * This route updates a tag by its identifier
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public update = async (request: UpdateTagRequest, response: Response, next: NextFunction) => {
        const name: string = request.params.name;
        if (!name) throw new InvalidInputError("name");
        const data: UpdateTagPayload = request.body.data;
        if (!data) throw new InvalidInputError('data');
        updateTag(name, data).then(data => {
            response.status(200).json({ data });
        }).catch(next);
    }

    /**
     * DELETE /tags/:name
     * This route deletes a tag by its identifier
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public delete = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.params.name) throw new InvalidInputError("Id");
        deleteTag(request.params.name).then(data => {
            response.status(200).json({ deleted: data });
        }).catch(next);
    }
}
