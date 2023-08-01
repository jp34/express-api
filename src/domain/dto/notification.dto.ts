import { NotificationType } from "../entity/notification";

export interface CreateNotificationPayload {
    notifiers: string[]
    type: NotificationType
};

export interface NotificationSearchParams {
    _id?: string
    actor?: string
    type?: string
    accepted?: boolean
};
