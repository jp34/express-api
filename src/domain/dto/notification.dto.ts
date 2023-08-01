import { NotificationType } from "../entity/notification";

export type CreateNotificationPayload = {
    notifiers: string[]
    type: NotificationType
};

export type NotificationSearchParams = {
    uid?: string
    actor?: string
    type?: string
    accepted?: boolean
};
