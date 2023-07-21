import { User } from "../../config/db";
import { InvalidOperationError, NonExistentResourceError } from "../models/error";
import { CreateUserPayload, IUser } from "../models/user";
import { findAccountByUid } from "./accounts.service";
import { findNotificationByUid } from "./notification.service";

// ---- Utility ------------

const sanitizeUserResponse = (data: any): IUser => {
    const user: IUser = {
        uid: data.uid,
        username: data.username,
        interests: data.interests,
        friends: data.friends,
        groups: data.groups,
        inbox: data.inbox,
        active: data.active,
        online: data.online,
        created: data.created,
        modified: data.modified,
    };
    return user;
}

// ---- User ------------

/**
 * This method will create a new user object with the given username and interests. A user can only be created for an
 * account that is not yet associated with a user profile.
 * @param payload Create user payload
 * @returns UserResponse if creation was success
 */
export const createUser = async (payload: CreateUserPayload): Promise<IUser> => {
    const account = await findAccountByUid(payload.uid);
    if (!account) throw new InvalidOperationError('Cannot create user for nonexistent account');
    const user = await User.findOne({ uid: account.uid });
    if (user) throw new InvalidOperationError('User already exists');
    const created = await User.create({
        uid: account.uid,
        username: payload.username,
        interests: payload.interests
    });
    return sanitizeUserResponse(created);
}

/**
 * This method will return an array of users, pagination is enabled via offset & limit.
 * @param offset Number of users to offset
 * @param limit Number of users to return
 * @returns An array of users
 */
export const findUsers = async (offset?: number, limit?: number): Promise<IUser[]> => {
    let results = [];
    if (offset && limit) results = await User.find().skip(offset).limit(limit);
    else if (offset && !limit) results = await User.find().skip(offset);
    else if (!offset && limit) results = await User.find().limit(limit);
    else results = await User.find();

    let users: IUser[] = [];
    results.forEach((result) => {
        users.push(sanitizeUserResponse(result));
    });
    return users;
}

/**
 * This method will return a user with the given uid, or undefined if one cannot be found.
 * @param uid Unique id to search by
 * @returns User response or undefined
 */
export const findUserByUid = async (uid: string): Promise<IUser | undefined> => {
    const user = await User.findOne({ uid });
    if (!user) return undefined;
    return sanitizeUserResponse(user);
}

/**
 * This method will determine if a user exists with a given uid
 * @param uid Unique id to check
 * @returns True if a user exists with that uid, otherwise false
 */
export const userExistsWithUid = async (uid: string): Promise<Boolean> => {
    const result = await User.exists({ uid });
    return (result != undefined);
}

/**
 * This method will determine if a user exists with a given username
 * @param username Username to check
 * @returns True if a user exists with that username, otherwise false
 */
export const userExistsWithUsername = async (username: string): Promise<Boolean> => {
    const result = await User.exists({ username });
    return (result != undefined);
}

/**
 * This method will change the username of a given user
 * @param uid Unique id of user
 * @param newname New username
 * @returns True if the name change was successful, otherwise false
 */
export const updateUsername = async (uid: string, newname: string): Promise<Boolean> => {
    const user = await User.findOne({ uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    if (user.username === newname) throw new InvalidOperationError("New username must be different from current");
    user.username = newname;
    user.modified = new Date(Date.now());
    await user.save();
    return true;
}

/**
 * This method will update a user's online status to the given status
 * @param uid Unique id of user
 * @param status New online status
 * @returns True if the update was successful, otherwise false
 */
export const updateOnlineStatus = async (uid: string, status: boolean): Promise<Boolean> => {
    const user = await User.findOne({ uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    user.online = status;
    await user.save();
    return true;
}

/**
 * This method will update a user's active status to the given status
 * @param uid Unique id of user
 * @param status New active status
 * @returns True if the update was successful, otherwise false
 */
export const updateActiveStatus = async (uid: string, status: boolean): Promise<Boolean> => {
    const user = await User.findOne({ uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    user.active = status;
    await user.save();
    return true;
}

/**
 * This method will delete a user. Any user will be automatically deleted
 * when the associated account deleted.
 * @param uid Unique id of the user
 * @returns True if the delete was successful, otherwise false
 */
export const deleteUser = async (uid: string): Promise<Boolean> => {
    const result = await User.deleteOne({ uid });
    return (result.acknowledged && (result.deletedCount == 1));
}

// ---- User Interests ------------

/**
 * This method will add one or more interests to a given user
 * @param uid Unique id of user
 * @param add Array of tags to add as interests
 * @returns Array of tags
 */
export const addUserInterests = async (uid: string, add: string[]): Promise<string[]> => {
    const user = await User.findOne({ uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    if (add.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    add.forEach((a) => {
        user.interests.push(a);
    });
    const saved = await user.save();
    return sanitizeUserResponse(saved).interests;
}

/**
 * This method will return a user's interests
 * @param uid Unique id of user
 * @returns Array of tags
 */
export const getUserInterests = async (uid: string): Promise<string[]> => {
    const user = await findUserByUid(uid);
    if (!user) throw new NonExistentResourceError("User", uid);
    return user.interests;
}

/**
 * This method will remove one or more interests to a given user
 * @param uid Unique id of user
 * @param add Array of tags to remove as interests
 * @returns Array of tags
 */
export const removeUserInterests = async (uid: string, remove: string[]): Promise<string[]> => {
    const user = await User.findOne({ uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    if (remove.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    user.interests = user.interests.filter((i) => {
        return !remove.includes(i);
    })
    const saved = await user.save();
    return sanitizeUserResponse(saved).interests;
}

// ---- User Friends ------------

/**
 * This method will return a user's friends
 * @param uid Unique id of user
 * @returns Array of connection id's
 */
export const getUserFriends = async (uid: string): Promise<string[]> => {
    const user = await findUserByUid(uid);
    if (!user) throw new NonExistentResourceError("User", uid);
    return user.friends;
}

// ---- User Groups ------------

/**
 * This method will return a user's groups
 * @param uid Unique id of user
 * @returns Array of connection id's
 */
export const getUserGroups = async (uid: string): Promise<string[]> => {
    const user = await findUserByUid(uid);
    if (!user) throw new NonExistentResourceError("User", uid);
    return user.groups;
}

// ---- User Inbox ----------------

/**
 * This method will return the inbox of the given user
 * @param uid User's unique id
 * @returns Array of notification id's
 */
export const getUserInbox = async (uid: string): Promise<String[]> => {
    const user = await findUserByUid(uid);
    if (!user) throw new NonExistentResourceError("User", uid);
    return user.inbox;
}

/**
 * This method will add a notification id to a user's inbox
 * @param uid User's unique id
 * @param noteId Notification's unique id
 * @returns True if operation was successful, otherwise false
 */
export const addToUserInbox = async (uid: string, noteId: string): Promise<Boolean> => {
    const user = await User.findOne({ uid });
    if (!user) throw new NonExistentResourceError("User", uid);
    const note = await findNotificationByUid(noteId);
    if (!note) throw new NonExistentResourceError("Notification", note);
    user.inbox.push(note.uid);
    await user.save();
    return true;
}
