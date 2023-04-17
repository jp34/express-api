"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tags_service_1 = require("../../services/tags.service");
const error_1 = require("../../config/error");
class TagsController {
    constructor() {
        /**
         * POST /tags
         * This route creates a new tag object
         * @param request Http request object
         * @param response Http response objet
         * @param next Next middleware function
         */
        this.create = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const data = request.body.data;
            if (!data)
                throw new error_1.InvalidInputError('data');
            (0, tags_service_1.createTag)(data.tag, data.label, data.plural, data.parent).then(data => {
                response.status(200).json({ status: "success", data: data });
            }).catch(next);
        });
        /**
         * GET /tags
         * This route returns an array of existing tags
         * @param request Http request object
         * @param response Http response object
         * @param next Next middleware function
         */
        this.getMany = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            let offset;
            let limit;
            if (request.query.offset)
                offset = +request.query.offset;
            if (request.query.limit)
                limit = +request.query.limit;
            (0, tags_service_1.findTags)(offset, limit).then((data) => __awaiter(this, void 0, void 0, function* () {
                const total = yield (0, tags_service_1.countTags)();
                response.status(200).json({ status: "success", data: data, meta: { count: data.length, total: total } });
            })).catch(next);
        });
        /**
         * GET /tags/:id
         * This route returns a single tag object
         * @param request Http request object
         * @param response Http response object
         * @param next Next middleware function
         */
        this.getOne = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            if (!request.params.id)
                throw new error_1.InvalidInputError("Id");
            (0, tags_service_1.locateTag)(request.params.id).then(data => {
                response.status(200).json({ status: "success", data: data });
            }).catch(next);
        });
        /**
         * PUT /tags/:id
         * This route updates a tag by its identifier
         * @param request Http request object
         * @param response Http response object
         * @param next Next middleware function
         */
        this.update = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            if (!request.params.id)
                throw new error_1.InvalidInputError("Id");
            (0, tags_service_1.updateTag)(request.params.id).then(data => {
                response.status(200).json({ status: "success", data: data });
            }).catch(next);
        });
        /**
         * DELETE /tags/:id
         * This route deletes a tag by its identifier
         * @param request Http request object
         * @param response Http response object
         * @param next Next middleware function
         */
        this.delete = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            if (!request.params.id)
                throw new error_1.InvalidInputError("Id");
            (0, tags_service_1.deleteTag)(request.params.id).then(data => {
                response.status(200).json({ status: "success", data: data });
            }).catch(next);
        });
    }
}
exports.default = TagsController;
