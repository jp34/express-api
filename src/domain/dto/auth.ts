import { Account } from "../entity/account";
import { CreateAccountPayload } from "./account.dto";

export interface AuthenticationPayload {
    identifier: string;
    password: string;
};

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
        data: CreateAccountPayload
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