
// Auth Payload Types

export type RegistrationPayload = {
    email: string;
    password: string;
    name: string;
    phone: string;
    birthday: string;
    username: string;
    interests: string[];
}

export type AuthenticationPayload = {
    identifier: string;
    password: string;
};

// Auth Request Interfaces

export interface RegistrationRequest extends Express.Request {
    body: {
        data: RegistrationPayload
    }
}

export interface AuthenticationRequest extends Express.Request {
    body: {
        data: AuthenticationPayload
    }
}

export interface RefreshRequest extends Express.Request {
    body: {
        data: {
            refresh: string
        }
    }
}
