import mongoose from "mongoose";
import { IAccount, AccountSchema } from "../app/models/account";
import { ITag, TagSchema } from "../app/models/tag";
import { IVenue, VenueSchema } from "../app/models/venue";
import { ConfigurationError } from "../app/models/error";
import tags from "../json/tags.json";

export const Account = mongoose.model<IAccount>("Account", AccountSchema);
export const Tag = mongoose.model<ITag>("Tag", TagSchema);
export const Venue = mongoose.model<IVenue>("Venue", VenueSchema);

export const connect = () => {
    const url = process.env.API_MONGO_STRING;
    if (!url) throw new ConfigurationError("Environment variable missing: API_MONGO_STRING");
    mongoose.set('strictQuery', false);
    mongoose.connect(url);
}

export const seed = () => {
    Tag.collection.insertMany(tags);
}
