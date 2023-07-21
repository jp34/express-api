import { Schema } from "mongoose";

export enum NotificationType {
    FRIEND_INVITE = "FRIEND_INVITE",
    FRIEND_ACCEPT = "FRIEND_ACCEPT",
    GROUP_INVITE = "GROUP_INVITE",
    EVENT_INVITE = "EVENT_INVITE"
}

export interface INotification {
    uid: string
    type: NotificationType
    actor: string
    notifiers: string[]
    created: Date
}

export const NotificationSchema = new Schema<INotification>({
    uid: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    actor: { type: String, required: true },
    notifiers: { type: [String], required: true },
    created: { type: Date, required: true, default: Date.now() }
});
