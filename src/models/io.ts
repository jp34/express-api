
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

// Request Interfaces

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

export interface DiscoveryRequest extends Express.Request {
    query: {
        method: string,
        lat: number,
        lng: number,
        search: string
    }
}
