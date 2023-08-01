
export type CreateAccountPayload = {
    email: string
    password: string
    name: string
    phone: string
    birthday: string
};

export type AccountSearchParams = {
    uid?: string
    email?: string
    name?: string
    phone?: string
    birthday?: string
    hasUser?: boolean
    isVerified?: boolean
    isLocked?: boolean
};
