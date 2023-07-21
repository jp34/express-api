import mongoose from "mongoose";
import { IAccount, AccountSchema } from "../app/models/account";
import { IUser, UserSchema } from "../app/models/user";
import { INotification, NotificationSchema } from "../app/models/notification";
import { ITag, TagSchema } from "../app/models/tag";
import { IVenue, VenueSchema } from "../app/models/venue";
import { IGroup, GroupSchema } from "../app/models/group";
import { ConfigurationError } from "../app/models/error";
import tags from "../json/tags.json";

export const Account = mongoose.model<IAccount>("Account", AccountSchema);
export const User = mongoose.model<IUser>("User", UserSchema);
export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export const Tag = mongoose.model<ITag>("Tag", TagSchema);
export const Venue = mongoose.model<IVenue>("Venue", VenueSchema);
export const Group = mongoose.model<IGroup>("Group", GroupSchema);

export const connect = () => {
    const url = process.env.API_MONGO_STRING;
    if (!url) throw new ConfigurationError("Environment variable missing: API_MONGO_STRING");
    mongoose.set('strictQuery', false);
    mongoose.connect(url);
}

export const seed = () => {
    Tag.collection.insertMany(tags);
}
