import mongoose from "mongoose";
import {
    IAccount,
    AccountSchema,
    ITag,
    TagSchema,
    IVenue,
    VenueSchema
} from "sn-core";
import { ConfigurationError } from "./error";


export const Account = mongoose.model<IAccount>("Account", AccountSchema);
export const Tag = mongoose.model<ITag>("Tag", TagSchema);
export const Venue = mongoose.model<IVenue>("Venue", VenueSchema);

export const connect = () => {
    const url = process.env.API_MONGO_STRING;
    if (!url) throw new ConfigurationError("Environment variable missing: API_MONGO_STRING");
    mongoose.set('strictQuery', false);
    mongoose.connect(url);
}
