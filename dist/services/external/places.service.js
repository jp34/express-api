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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.placesSearch = void 0;
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../../models/error");
const API_FOURSQUARE_KEY = (_a = process.env.API_FOURSQUARE_KEY) !== null && _a !== void 0 ? _a : undefined;
const placesSearch = (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!API_FOURSQUARE_KEY)
        throw new error_1.ConfigurationError('Environment variable API_FOURSQUARE_KEY is missing or invalid');
    axios_1.default.get(`https://api.foursquare.com/v3/places/search?${options.toString()}`, {
        headers: {
            Authorization: API_FOURSQUARE_KEY,
            Accept: 'application/json'
        }
    }).then((response) => {
        return response.data.results;
    }).catch((err) => {
        throw new error_1.ServerError(err);
    });
});
exports.placesSearch = placesSearch;
