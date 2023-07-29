import mongoose, { Schema } from "mongoose";

// ---- Notification Model ----------------

export enum NotificationType {
    NOTE = "NOTE",
    FRIEND_INVITE = "FRIEND_INVITE",
    FRIEND_ACCEPT = "FRIEND_ACCEPT",
    GROUP_INVITE = "GROUP_INVITE",
    EVENT_INVITE = "EVENT_INVITE"
}

export interface Notification {
    uid: string
    actor: string
    notifiers: string[]
    type: NotificationType
    accepted?: boolean
    dateCreated: Date
    dateModified: Date
}

// ---- Mongoose Model ----------------

export interface NotificationDTO {
    uid: string
    actor: string
    notifiers: string[]
    type: NotificationType
    accepted?: boolean
    dateCreated: Date
    dateModified: Date
}

export const toNotificationDTO = (data: Notification): NotificationDTO => {
    let dto: NotificationDTO = {
        uid: data.uid,
        actor: data.actor,
        notifiers: data.notifiers,
        type: data.type,
        accepted: data.accepted,
        dateCreated: data.dateCreated,
        dateModified: data.dateModified
    };
    return dto;
}

// ---- Mongoose Model ----------------

export const NotificationSchema = new Schema<Notification>({
    uid: { type: String, required: true, unique: true },
    actor: { type: String, required: true },
    notifiers: { type: [String], required: true },
    type: { type: String, required: true },
    accepted: { type: Boolean },
    dateCreated: { type: Date, required: true, default: Date.now() },
    dateModified: { type: Date, required: true, default: Date.now() }
});

export const NotificationModel = mongoose.model<Notification>("Notification", NotificationSchema);
