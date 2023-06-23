"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const logger_1 = __importDefault(require("./config/logger"));
logger_1.default.debug(`API_PORT: ${process.env.API_PORT}`);
logger_1.default.debug(`API_ACCESS_SECRET: ${process.env.API_ACCESS_SECRET}`);
logger_1.default.debug(`API_REFRESH_SECRET: ${process.env.API_REFRESH_SECRET}`);
logger_1.default.debug(`API_ACCESS_EXP: ${process.env.API_ACCESS_EXP}`);
logger_1.default.debug(`API_REFRESH_EXP: ${process.env.API_REFRESH_EXP}`);
logger_1.default.debug(`API_MONGO_STRING: ${process.env.API_MONGO_STRING}`);
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const router_1 = __importDefault(require("./app/router"));
const error_1 = require("./app/middleware/error");
// Configure database
const db_1 = require("./config/db");
(0, db_1.connect)();
// Configure app
const app = (0, express_1.default)();
const port = process.env.API_PORT;
// Configure middleware
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)("combined"));
// Configure root controller
app.use(router_1.default);
app.use(error_1.handle);
// Start app
app.listen(port, () => {
    logger_1.default.info(`Server starting on port ${port}...`);
});
