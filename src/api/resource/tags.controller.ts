import { Request, Response, NextFunction } from "express";
import {
    createTag,
    findTags,
    locateTag,
    updateTag,
    deleteTag,
    countTags
} from "../../services/tags.service";
import { CreateTagPayload, UpdateTagPayload } from "sn-core";
import { CreateTagRequest, UpdateTagRequest } from "../../config/io";
import { InvalidInputError } from "../../config/error";

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
        createTag(data.tag, data.label, data.plural, data.parent).then(data => {
            response.status(200).json({ status: "success", data: data});
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
            const total = await countTags();
            response.status(200).json({ status: "success", data: data, meta: { count: data.length, total: total }});
        }).catch(next);
    }

    /**
     * GET /tags/:id
     * This route returns a single tag object
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public getOne = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.params.id) throw new InvalidInputError("Id");
        locateTag(request.params.id).then(data => {
            response.status(200).json({ status: "success", data: data });
        }).catch(next);
    }

    /**
     * PUT /tags/:id
     * This route updates a tag by its identifier
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public update = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.params.id) throw new InvalidInputError("Id");
        updateTag(request.params.id).then(data => {
            response.status(200).json({ status: "success", data: data });
        }).catch(next);
    }

    /**
     * DELETE /tags/:id
     * This route deletes a tag by its identifier
     * @param request Http request object
     * @param response Http response object
     * @param next Next middleware function
     */
    public delete = async (request: Request, response: Response, next: NextFunction) => {
        if (!request.params.id) throw new InvalidInputError("Id");
        deleteTag(request.params.id).then(data => {
            response.status(200).json({ status: "success", data: data });
        }).catch(next);
    }
}
