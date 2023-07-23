import { v4 } from "uuid";
import { NotificationModel, Notification, NotificationType } from "../../domain/entity/notification";
import { InvalidOperationError } from "../../domain/entity/error";
import { addToUserInbox } from "./users.service";

// ---- Utility ------------

/**
 * This method will sanatize the given data and return a new Notification object
 * @param data Object to be sanitized
 * @returns Notification object
 */
export const sanitizeNotificationResponse = (data: any): Notification => {
    const note: Notification = {
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
 * @param actor Unique id of account who initiated the operation
 * @param notifiers Array of user uid's whom should be notified 
 * @param type Type of notification to create
 * @returns Notification object
 */
export const createNotification = async (
    actor: string,
    notifiers: string[],
    type: NotificationType
): Promise<Notification> => {
    if (notifiers.length < 1) throw new InvalidOperationError("Notification must have at least one notifier");
    const note = await NotificationModel.create({
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
 * @param actor Unique id of account that initiated the operation
 * @param note Unique id of the notification to search for
 * @returns Notification if found, otherwise false
 */
export const findNotification = async (actor: string, note: string): Promise<Notification | undefined> => {
    const n = await NotificationModel.findOne({ uid: note });
    if (!n) return undefined;
    return sanitizeNotificationResponse(n);
}

export const findNotifications = async (offset?: number, limit?: number): Promise<Notification[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const results = await NotificationModel.find().limit(lim).skip(off);
    let notes: Notification[] = [];
    results.forEach((result) => {
        notes.push(sanitizeNotificationResponse(result));
    });
    return notes;
}

export const findNotificationsByActor = async (actor: string, offset?: number, limit?: number): Promise<Notification[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const results = await NotificationModel.find({ actor }).limit(lim).skip(off);
    let notes: Notification[] = [];
    results.forEach((result) => {
        notes.push(sanitizeNotificationResponse(result));
    });
    return notes;
}

export const findNotificationsByNotifier = async (notifier: string, offset?: number, limit?: number): Promise<Notification[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const results = await NotificationModel.find({
        notifiers: {
            $all: [
                notifier
            ]
        }
    }).limit(lim).skip(off);
    let notes: Notification[] = [];
    results.forEach((result) => {
        notes.push(sanitizeNotificationResponse(result));
    });
    return notes;
}
