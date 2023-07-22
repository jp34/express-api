import mongoose from "mongoose";
import { IAccount, AccountSchema } from "../domain/models/account";
import { IUser, UserSchema } from "../domain/models/user";
import { INotification, NotificationSchema } from "../domain/models/notification";
import { ITag, TagSchema } from "../domain/models/tag";
import { IVenue, VenueSchema } from "../domain/models/venue";
import { IGroup, GroupSchema } from "../domain/models/group";

export const Account = mongoose.model<IAccount>("Account", AccountSchema);
export const User = mongoose.model<IUser>("User", UserSchema);
export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export const Tag = mongoose.model<ITag>("Tag", TagSchema);
export const Venue = mongoose.model<IVenue>("Venue", VenueSchema);
export const Group = mongoose.model<IGroup>("Group", GroupSchema);
