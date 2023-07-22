import { Schema } from "mongoose";

export enum NotificationType {
    NOTE = "NOTE",
    FRIEND_INVITE = "FRIEND_INVITE",
    FRIEND_ACCEPT = "FRIEND_ACCEPT",
    GROUP_INVITE = "GROUP_INVITE",
    EVENT_INVITE = "EVENT_INVITE"
}

export interface INotification {
    uid: string
    actor: string
    notifiers: string[]
    type: NotificationType
    accepted?: boolean
    created: Date
}

export const NotificationSchema = new Schema<INotification>({
    uid: { type: String, required: true, unique: true },
    actor: { type: String, required: true },
    notifiers: { type: [String], required: true },
    type: { type: String, required: true },
    accepted: { type: Boolean },
    created: { type: Date, required: true, default: Date.now() }
});
