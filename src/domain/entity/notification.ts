import { v4 } from "uuid";
import mongoose, { Schema } from "mongoose";

export enum NotificationType {
    NOTE = "NOTE",
    FRIEND_INVITE = "FRIEND_INVITE",
    FRIEND_ACCEPT = "FRIEND_ACCEPT",
    GROUP_INVITE = "GROUP_INVITE",
    EVENT_INVITE = "EVENT_INVITE"
}

export interface Notification {
    _id: string
    actor: string
    notifiers: string[]
    type: NotificationType
    accepted?: boolean
    dateCreated: Date
    dateModified: Date
}

export const NotificationSchema = new Schema<Notification>({
    _id: { type: String, default: v4 },
    actor: { type: String, required: true },
    notifiers: { type: [String], required: true },
    type: { type: String, required: true },
    accepted: { type: Boolean },
    dateCreated: { type: Date, required: true, default: Date.now() },
    dateModified: { type: Date, required: true, default: Date.now() }
});

export const NotificationModel = mongoose.model<Notification>("Notification", NotificationSchema);
