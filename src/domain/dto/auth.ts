import { Account } from "../entity/account";

// Auth Payload Types

export interface RegistrationPayload {
    email: string;
    password: string;
    name: string;
    phone: string;
    birthday: string;
}

export interface AuthenticationPayload {
    identifier: string;
    password: string;
};

// Auth Response Types

export type AuthResponse = {
    account: Account;
    tokens: {
        access: string
        refresh: string
    }
};

// Auth Request Interfaces

export interface RegistrationRequest extends Express.Request {
    user?: Record<string, any>
    ip?: string
    body: {
        data: RegistrationPayload
    }
}

export interface AuthenticationRequest extends Express.Request {
    user?: Record<string, any>
    ip?: string
    body: {
        data: AuthenticationPayload
    }
}

export interface RefreshRequest extends Express.Request {
    user?: Record<string, any>
    ip?: string
    body: {
        data: {
            refresh: string
        }
    }
}