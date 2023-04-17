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
const mongoose_1 = require("mongoose");
const accounts_service_1 = require("../../services/accounts.service");
const error_1 = require("../../config/error");
class AccountsController {
    constructor() {
        /**
         * GET /accounts
         * This route returns an array of account objects
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
            (0, accounts_service_1.findAccounts)(offset, limit).then(data => {
                response.status(200).json({ status: "success", data: data });
                next();
            }).catch(next);
        });
        /**
         * GET /accounts/:id
         * This route returns a single account object
         * @param request Http request object
         * @param response Http response object
         * @param next Next middleware function
         */
        this.getOne = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            if (!request.params.id)
                throw new error_1.InvalidInputError("Id");
            (0, accounts_service_1.findAccountById)(request.params.id).then(data => {
                response.status(200).json({ status: "success", data: data });
                next();
            }).catch(next);
        });
        /**
         * PUT /accounts/:id
         * This route updates a single account object
         * @param request Http request object
         * @param response Http response object
         * @param next Next middleware function
         */
        this.update = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const data = request.body.data;
            if (!id)
                throw new error_1.InvalidInputError('id');
            if (!data)
                throw new error_1.InvalidInputError('data');
            (0, accounts_service_1.updateAccount)(id, data).then(data => {
                response.status(200).json({ status: "success", data: data });
                next();
            }).catch(next);
        });
        /**
         * DELETE /accounts/:id
         * This route deletes a single account object
         * @param request Http request object
         * @param response Http response object
         * @param next Next middleware function
         */
        this.delete = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            if (!(0, mongoose_1.isValidObjectId)(id))
                throw new error_1.InvalidInputError("Id");
            (0, accounts_service_1.deleteAccount)(id).then(data => {
                response.status(200).json({ status: "success", data: data });
                next();
            }).catch(next);
        });
    }
}
exports.default = AccountsController;
