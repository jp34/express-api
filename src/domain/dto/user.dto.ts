
export type CreateUserPayload = {
    username: string
    interests: string[]
};

export type UserSearchParams = {
    uid?: string
    username?: string
    isActive?: boolean
    isOnline?: boolean
};
