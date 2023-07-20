import { User } from "../../config/db";
import { InvalidOperationError, NonExistentResourceError } from "../models/error";
import { CreateUserPayload, UserResponse } from "../models/user";
import { findAccountByUid } from "./accounts.service";

const sanitizeUserResponse = (data: any): UserResponse => {
    const user: UserResponse = {
        uid: data.uid,
        username: data.username,
        interests: data.interests,
        active: data.active,
        online: data.online,
        created: data.created,
        modified: data.modified,
    };
    return user;
}

export const createUser = async (payload: CreateUserPayload): Promise<UserResponse> => {
    const account = await findAccountByUid(payload.uid);
    if (!account) throw new InvalidOperationError('Cannot create user for nonexistent account');
    const user = await User.findOne({ uid: account.uid });
    if (user) throw new InvalidOperationError('User already exists');
    const created = await User.create({
        uid: account.uid,
        username: payload.username,
    });
    return sanitizeUserResponse(created);
}

export const findUsers = async (offset?: number, limit?: number): Promise<[UserResponse?]> => {
    let results = [];
    if (offset && limit) results = await User.find().skip(offset).limit(limit);
    else if (offset && !limit) results = await User.find().skip(offset);
    else if (!offset && limit) results = await User.find().limit(limit);
    else results = await User.find();

    let users: [UserResponse?] = [];
    results.forEach((result) => {
        users.push(sanitizeUserResponse(result));
    });
    return users;
}

export const findUserByUid = async (uid: string): Promise<UserResponse> => {
    const user = await User.findOne({ uid });
    return sanitizeUserResponse(user);
}

export const updateUsername = async (uid: string, newname: string) => {
    const user = await User.findOne({ uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    if (user.username === newname) throw new InvalidOperationError("New username must be different from current");
    user.username = newname;
    user.modified = new Date(Date.now());
    const saved = await user.save();
    return sanitizeUserResponse(saved);
}

export const getUserInterests = async (uid: string) => {
    const user = await findUserByUid(uid);
    return user.interests;
}

export const addUserInterests = async (uid: string, add: string[]) => {
    const user = await User.findOne({ uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    if (add.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    add.forEach((a) => {
        user.interests.push(a);
    });
    const saved = await user.save();
    return sanitizeUserResponse(saved).interests;
}

export const removeUserInterests = async (uid: string, remove: string[]) => {
    const user = await User.findOne({ uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    if (remove.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    user.interests = user.interests.filter((i) => {
        return !remove.includes(i);
    })
    const saved = await user.save();
    return sanitizeUserResponse(saved).interests;
}

export const deleteUser = async (uid: string) => {
    const result = await User.deleteOne({ uid });
    return (result.acknowledged && (result.deletedCount == 1));
}
