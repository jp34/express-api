import { v4 } from "uuid";
import { Notification } from "../../config/db";
import { InvalidOperationError, NonExistentResourceError } from "../models/error";
import { INotification, NotificationType } from "../models/notification";
import { addToUserInbox, getUserInbox, userExistsWithUid } from "./users.service";

export const sanitizeNotificationResponse = (data: any): INotification => {
    const note: INotification = {
        uid: data.uid,
        type: data.type,
        actor: data.actor,
        notifiers: data.notifiers,
        created: data.created,
    };
    return note;
}

export const createNotification = async (
    actor: string,
    notifiers: string[],
    type: NotificationType
): Promise<INotification> => {
    const actorExists = await userExistsWithUid(actor);
    if (!actorExists) throw new NonExistentResourceError("User", actor);
    if (notifiers.length < 1) throw new InvalidOperationError("Notification must have at least one notifier");
    const note = await Notification.create({
        uid: v4(),
        actor,
        notifiers,
        type
    });

    notifiers.forEach(async (n) => {
        await addToUserInbox(n, note.uid);
    });

    return sanitizeNotificationResponse(note);
}

export const findNotificationByUid = async (uid: string): Promise<INotification> => {
    const note = await Notification.findOne({ uid });
    if (!note) throw new NonExistentResourceError("Notification", uid);
    return sanitizeNotificationResponse(note);
}

export const findNotifications = async (offset?: number, limit?: number): Promise<INotification[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const results = await Notification.find().limit(lim).skip(off);
    let notes: INotification[] = [];
    results.forEach((result) => {
        notes.push(sanitizeNotificationResponse(result));
    });
    return notes;
}

export const findNotificationsByActor = async (actor: string, offset?: number, limit?: number): Promise<INotification[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const results = await Notification.find({ actor }).limit(lim).skip(off);
    let notes: INotification[] = [];
    results.forEach((result) => {
        notes.push(sanitizeNotificationResponse(result));
    });
    return notes;
}

export const findNotificationsByNotifier = async (notifier: string, offset?: number, limit?: number): Promise<INotification[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const results = await Notification.find({
        notifiers: {
            $all: [
                notifier
            ]
        }
    }).limit(lim).skip(off);
    let notes: INotification[] = [];
    results.forEach((result) => {
        notes.push(sanitizeNotificationResponse(result));
    });
    return notes;
}
