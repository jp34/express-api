import dotenv from "dotenv";
dotenv.config();
import logger from "../config/logger";
import { ConfigurationError } from "../app/models/error";

const PORT = process.env.API_PORT;
if (!PORT) throw new ConfigurationError("Missing or invalid environment variable: API_PORT");
logger.debug(`PORT: ${PORT}`);

const ACCESS_SECRET = process.env.API_ACCESS_SECRET;
if (!ACCESS_SECRET) throw new ConfigurationError("Missing or invalid environment variable: API_ACCESS_SECRET");
logger.debug(`ACCESS_SECRET: ${ACCESS_SECRET}`);

const ACCESS_EXP = process.env.API_ACCESS_EXP;
if (!ACCESS_EXP) throw new ConfigurationError("Missing or invalid environment variable: API_ACCESS_EXP");
logger.debug(`ACCESS_EXP: ${ACCESS_EXP}`);

const REFRESH_SECRET = process.env.API_REFRESH_SECRET;
if (!REFRESH_SECRET) throw new ConfigurationError("Missing or invalid environment variable: API_REFRESH_SECRET");
logger.debug(`REFRESH_SECRET: ${REFRESH_SECRET}`);

const REFRESH_EXP = process.env.API_REFRESH_EXP;
if (!REFRESH_EXP) throw new ConfigurationError("Missing or invalid environment variable: API_REFRESH_EXP");
logger.debug(`REFRESH_EXP: ${REFRESH_EXP}`);

const MONGO_STRING = process.env.API_MONGO_STRING;
if (!MONGO_STRING) throw new ConfigurationError("Missing or invalid environment variable: API_MONGO_STRING");
logger.debug(`MONGO_STRING: ${MONGO_STRING}`);

const Env = {
    PORT,
    ACCESS_SECRET,
    ACCESS_EXP,
    REFRESH_SECRET,
    REFRESH_EXP,
    MONGO_STRING
};

export default Env;
