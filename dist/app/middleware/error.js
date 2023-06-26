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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const error_1 = require("../models/error");
const logger_1 = __importDefault(require("../../config/logger"));
const handle = (err, request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.error(`${err.name} ocurred: ${err.message}`);
    if (err instanceof error_1.InvalidInputError) {
        response.status(400).json({ error: err.message });
    }
    else if (err instanceof error_1.UnauthorizedError) {
        response.status(406).json({ error: err.message });
    }
    else if (err instanceof error_1.ServerError) {
        response.status(500).json({ error: "Server error" });
    }
    next();
});
exports.handle = handle;
