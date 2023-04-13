import {
    CreateAccountPayload,
    CreateTagPayload,
    UpdateAccountPayload,
    UpdateTagPayload
} from "sn-core";

// Auth requests

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

// Account

export interface UpdateAccountRequest extends Express.Request {
    params: {
        id: string
    },
    body: {
        data: UpdateAccountPayload
    }
}

// Tag

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

// Discovery

export interface DiscoveryRequest extends Express.Request {
    query: {
        method: string,
        lat: number,
        lng: number,
        search: string
    }
}
