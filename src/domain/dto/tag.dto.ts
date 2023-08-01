
export interface CreateTagPayload {
    name: string
    label: string
    parent: string
    ref: string
}

export interface TagSearchParams {
    name?: string
    parent?: string
    ref?: string
}

export interface CreateTagRequest extends Express.Request {
    body: {
        data: CreateTagPayload
    }
}
