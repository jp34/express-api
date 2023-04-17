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
const discovery_service_1 = require("../../services/discovery.service");
const logger_1 = __importDefault(require("../../config/logger"));
class DiscoveryController {
    constructor() {
        /**
         * Get /discovery
         * This route returns a list of recommended locations based on the given location,
         * and user interests
         * @param request Http request object
         * @param response Http response object
         * @param next Next middleware function
         */
        this.get = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = request.query;
                const searchResult = yield (0, discovery_service_1.discoverNearby)(query.lat, query.lng, query.search);
            }
            catch (err) {
                logger_1.default.warn(err);
            }
        });
    }
}
exports.default = DiscoveryController;
