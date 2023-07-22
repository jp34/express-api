import { v4 } from "uuid";
import { Notification } from "../../domain/domain";
import { InvalidOperationError } from "../../domain/models/error";
import { INotification, NotificationType } from "../../domain/models/notification";
import { addToUserInbox } from "./users.service";

// ---- Utility ------------

/**
 * This method will sanatize the given data and return a new INotification object
 * @param data Object to be sanitized
 * @returns INotification object
 */
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

// ---- Notification ------------

/**
 * This method will create a new notification and notify the associated users
 * @param actor Unique id of user who initiated operation
 * @param notifiers Array of user uid's whom should be notified 
 * @param type Type of notification to create
 * @returns INotification object
 */
export const createNotification = async (
    actor: string,
    notifiers: string[],
    type: NotificationType
): Promise<INotification> => {
    if (notifiers.length < 1) throw new InvalidOperationError("Notification must have at least one notifier");
    const note = await Notification.create({
        uid: v4(),
        actor,
        notifiers,
        type
    });
    notifiers.forEach(async (n) => {
        await addToUserInbox(actor, n, note.uid);
    });
    return sanitizeNotificationResponse(note);
}

/**
 * This method will try to find a notification with the given id (note). If the note cannot be
 * found, it will return undefined.
 * @param actor Unique id of user who initiated operation
 * @param note Unique id of the notification to search for
 * @returns INotification if found, otherwise false
 */
export const findNotification = async (actor: string, note: string): Promise<INotification | undefined> => {
    const n = await Notification.findOne({ uid: note });
    if (!n) return undefined;
    return sanitizeNotificationResponse(n);
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
