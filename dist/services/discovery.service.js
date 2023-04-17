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
exports.discoverNearby = void 0;
const sn_core_1 = require("sn-core");
const error_1 = require("../config/error");
const logger_1 = __importDefault(require("../config/logger"));
const API_KEY = process.env.FOURSQUARE_API_KEY;
const discoverNearby = (lat, lng, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!API_KEY)
            throw new error_1.ConfigurationError("Missing environment variable: FOURSQUARE_API_KEY");
        const result = yield (0, sn_core_1.placesSearchByIp)(lat, lng, query, API_KEY);
        return result;
    }
    catch (err) {
        logger_1.default.warn("Request to Foursquare Places API resulted in error: ");
        logger_1.default.error(err);
        return false;
    }
});
exports.discoverNearby = discoverNearby;
