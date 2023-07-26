import { AccountDTO } from "./entity/account";

// Auth Payload Types

export interface RegistrationPayload {
    email: string;
    password: string;
    name: string;
    phone: string;
    birthday: string;
}

export interface MobileRegistrationPayload extends RegistrationPayload{
    email: string;
    password: string;
    name: string;
    phone: string;
    birthday: string;
    username: string;
    interests: string[];
};

export interface AuthenticationPayload {
    identifier: string;
    password: string;
};

// Auth Response Types

export type AuthResponse = {
    account: AccountDTO;
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

export interface MobileRegistrationRequest extends Express.Request {
    user?: Record<string, any>
    ip?: string
    body: {
        data: MobileRegistrationPayload
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
