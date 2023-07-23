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
    created: Date
}

// ---- Mongoose Model ----------------

export interface NotificationDTO {
    uid?: string
    actor?: string
    notifiers?: string[]
    type?: NotificationType
    accepted?: boolean
    created?: Date
}

export const toNotificationDTO = (data: Notification): NotificationDTO => {
    let dto: NotificationDTO = {};
    if (data.uid) dto.uid = data.uid;
    if (data.actor) dto.actor = data.actor;
    if (data.notifiers) dto.notifiers = data.notifiers;
    if (data.type) dto.type = data.type;
    if (data.accepted) dto.accepted = data.accepted;
    if (data.created) dto.created = data.created;
    return dto;
}

// ---- Mongoose Model ----------------

export const NotificationSchema = new Schema<Notification>({
    uid: { type: String, required: true, unique: true },
    actor: { type: String, required: true },
    notifiers: { type: [String], required: true },
    type: { type: String, required: true },
    accepted: { type: Boolean },
    created: { type: Date, required: true, default: Date.now() }
});

export const NotificationModel = mongoose.model<Notification>("Notification", NotificationSchema);
