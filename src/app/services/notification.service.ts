import { v4 } from "uuid";
import { NotificationModel, Notification } from "../../domain/entity/notification";
import { InvalidOperationError, NonExistentResourceError } from "../../domain/error";
import { addToUserInbox } from "./users.service";
import { CreateNotificationPayload, NotificationSearchParams } from "../../domain/dto/notification.dto";
import logger from "../../config/logger";

/**
 * This method will create a new notification and notify the associated users
 * @param actor Unique id of account who initiated the operation
 * @param payload Values to initialize notification with
 * @returns Notification object
 */
export const createNotification = async (actor: string, payload: CreateNotificationPayload): Promise<Notification> => {
    if (payload.notifiers.length < 1) throw new InvalidOperationError("Notification must have at least one notifier");
    const uid = v4();
    await NotificationModel.create({
        uid,
        actor,
        notifiers: payload.notifiers,
        type: payload.type
    });
    const note = await findNotification(actor, { uid });
    payload.notifiers.forEach(async (n) => {
        await addToUserInbox(actor, { uid: n }, note.uid);
    });
    logger.info({
        operation: "createNotification",
        actor,
        payload,
        resource: `note:${note.uid}`
    });
    return note;
}

/**
 * This method will try to find a notification with the given id (note). If the note cannot be
 * found, it will return undefined.
 * @param actor Unique id of account that initiated the operation
 * @param note Unique id of the notification to search for
 * @returns Notification if found, otherwise false
 */
export const findNotification = async (actor: string, params: NotificationSearchParams): Promise<Notification> => {
    const note = await NotificationModel.findOne(params).select('-_id');
    if (!note) throw new NonExistentResourceError("notification", JSON.stringify(params));
    logger.info({
        operation: "findNotification",
        actor,
        params,
        resource: `note:${note.uid}`
    });
    return note;
}

export const findNotifications = async (actor: string, params: NotificationSearchParams, offset?: number, limit?: number): Promise<Notification[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const notes = await NotificationModel.find(params).limit(lim).skip(off).select('-_id');
    logger.info({
        operation: "findNotifications",
        actor,
        params,
        additionalParams: { offset, limit }
    });
    return notes;
}
