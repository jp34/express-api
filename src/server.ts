import dotenv from "dotenv";
dotenv.config();
import logger from "./config/logger";
logger.debug(`API_PORT: ${process.env.API_PORT}`);
logger.debug(`API_ACCESS_SECRET: ${process.env.API_ACCESS_SECRET}`);
logger.debug(`API_REFRESH_SECRET: ${process.env.API_REFRESH_SECRET}`);
logger.debug(`API_ACCESS_EXP: ${process.env.API_ACCESS_EXP}`);
logger.debug(`API_REFRESH_EXP: ${process.env.API_REFRESH_EXP}`);
logger.debug(`MONGO_STRING: ${process.env.API_MONGO_STRING}`);
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import api from "./api/api.router";
import { handle } from "./middleware/error";

// Configure database
import { connect } from "./config/db";
connect();

// Configure app
const app = express();
const port = process.env.API_PORT;

// Configure middleware
app.use(bodyParser.json());
app.use(morgan("combined"));

// Configure root controller
app.use("/api", api);
app.use(handle);

// Start app
app.listen(port, () => {
    logger.info(`Server starting on port ${port}...`);
});
