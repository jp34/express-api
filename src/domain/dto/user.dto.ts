
export interface CreateUserPayload {
    username: string
    interests: string[]
};

export interface UserSearchParams {
    _id?: string
    username?: string
    isActive?: boolean
    isOnline?: boolean
};
