import { CreateAccountPayload } from "./account"

// Auth Request Interfaces

export interface SignupRequest extends Express.Request {
    body: {
        data: CreateAccountPayload
    }
}

export interface LoginRequest extends Express.Request {
    body: {
        data: {
            email: string,
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