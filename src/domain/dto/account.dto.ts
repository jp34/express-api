
export interface CreateAccountPayload {
    email: string
    password: string
    name: string
    phone: string
    birthday: string
};

export interface AccountSearchParams {
    _id?: string
    email?: string
    name?: string
    phone?: string
    birthday?: string
    hasUser?: boolean
    isVerified?: boolean
    isLocked?: boolean
};
