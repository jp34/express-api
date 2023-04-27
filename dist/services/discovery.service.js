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
exports.placesSearchByIp = exports.discoverNearby = void 0;
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../models/error");
const logger_1 = __importDefault(require("../config/logger"));
const API_KEY = process.env.FOURSQUARE_API_KEY;
const discoverNearby = (lat, lng, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!API_KEY)
            throw new error_1.ConfigurationError("Missing environment variable: FOURSQUARE_API_KEY");
        const result = yield (0, exports.placesSearchByIp)(lat, lng, query, API_KEY);
        return result;
    }
    catch (err) {
        logger_1.default.warn("Request to Foursquare Places API resulted in error: ");
        logger_1.default.error(err);
        return false;
    }
});
exports.discoverNearby = discoverNearby;
const placesSearchByIp = (lat, lng, query, key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = new URLSearchParams({
            ll: `${lat},${lng}`,
            query: query,
            open_now: 'true',
            sort: 'DISTANCE'
        });
        const url = `https://api.foursquare.com/v3/places/search?${search}`;
        const response = yield axios_1.default.get(url, {
            headers: {
                Accept: 'application/json',
                Authorization: key,
            }
        });
        if (response.status != 200)
            throw Error('Places search responded with error');
        return response.data;
    }
    catch (err) {
        console.error(err);
    }
});
exports.placesSearchByIp = placesSearchByIp;
