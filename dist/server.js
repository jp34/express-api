"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./config/logger"));
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
// Configure middleware
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)("combined"));
// Configure root controller
app.use(router_1.default);
app.use(error_1.handle);
// Start app
app.listen(env_1.default.PORT, () => {
    logger_1.default.info(`Server listening on port ${env_1.default.PORT}...`);
});
exports.default = app;
