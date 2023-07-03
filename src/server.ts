import Env from "./config/env";
import logger from "./config/logger";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import api from "./app/router";
import { handle } from "./app/middleware/error";

// Configure database
import { connect } from "./config/db";
connect();

// Configure app
const app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(morgan("combined"));

// Configure root controller
app.use(api);
app.use(handle);

// Start app
app.listen(parseInt(Env.PORT), Env.HOST, () => {
    logger.info(`Server listening on port ${Env.PORT}...`);
});

export default app;
