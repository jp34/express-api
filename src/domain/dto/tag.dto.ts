
export interface CreateTagPayload {
    _id: string
    name: string
    label: string
    parent: string
    ref: string
}

export interface CreateTagRequest extends Express.Request {
    body: {
        data: CreateTagPayload
    }
}
