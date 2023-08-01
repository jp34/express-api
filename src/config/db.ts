import mongoose from "mongoose";
import { ConfigurationError } from "../domain/error";
import { TagModel } from "../domain/entity/tag";
import tags from "../domain/json/tags.json";

export const connect = () => {
    const url = process.env.API_MONGO_STRING;
    if (!url) throw new ConfigurationError("Environment variable missing: API_MONGO_STRING");
    mongoose.set('strictQuery', false);
    mongoose.connect(url);
}

export const seed = () => {
    TagModel.collection.insertMany(tags.map((tag) => {
        return {
            ...tag,
            dateCreated: new Date(Date.now()),
            dateModified: new Date(Date.now())
        }
    }));
}
