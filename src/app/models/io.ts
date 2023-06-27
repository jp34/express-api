
// Payload Types

export type CreateTagPayload = {
    tag: string;
    label: string;
    plural: string;
    parent: string;
    ref: string;
}

export type UpdateTagPayload = {
    label?: string;
    plural?: string;
    parent?: string;
    ref?: string;
}

export type TagResponse = {
    tag: string;
    label: string;
    plural: string;
    level?: string;
    parent?: string;
    ref?: string;
}

export type CreateAccountPayload = {
    email: string;
    password: string;
    username: string;
    phone: string;
    birthday: string;
}

export type UpdateAccountPayload = {
    email?: string;
    password?: string;
    username?: string;
    phone?: string;
    birthday?: string;
}

export type AccountResponse = {
    email: string;
    password: string;
    username: string;
    phone?: string;
    birthday: string;
    verified?: boolean;
    locked?: boolean;
    deactivated?: boolean;
    created?: Date;
    modified?: Date;
}

export interface SignupRequest extends Express.Request {
    body: {
        data: CreateAccountPayload
    }
}

export interface LoginRequest extends Express.Request {
    body: {
        data: {
            identifier: string,
            password: string
        }
    }
}

export interface RefreshRequest extends Express.Request {
    body: {
        data: {
            refresh: string
        }
    }
}

export interface UpdateAccountRequest extends Express.Request {
    params: {
        id: string
    },
    body: {
        data: UpdateAccountPayload
    }
}

export interface CreateTagRequest extends Express.Request {
    body: {
        data: CreateTagPayload
    }
}

export interface UpdateTagRequest extends Express.Request {
    params: {
        id: string
    },
    body: {
        data: UpdateTagPayload
    }
}
