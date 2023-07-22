import mongoose from "mongoose";
import { ConfigurationError } from "../domain/models/error";
import { Tag } from "../domain/domain";
import tags from "../domain/json/tags.json";

export const connect = () => {
    const url = process.env.API_MONGO_STRING;
    if (!url) throw new ConfigurationError("Environment variable missing: API_MONGO_STRING");
    mongoose.set('strictQuery', false);
    mongoose.connect(url);
}

export const seed = () => {
    Tag.collection.insertMany(tags);
}
