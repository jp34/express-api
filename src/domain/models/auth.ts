
// Auth Payload Types

export type RegistrationPayload = {
    email: string;
    password: string;
    name: string;
    phone: string;
    birthday: string;
}

export type AuthenticationPayload = {
    identifier: string;
    password: string;
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
