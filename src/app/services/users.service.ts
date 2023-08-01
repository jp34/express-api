import { User, UserModel } from "../../domain/entity/user";
import { CreateUserPayload, UserSearchParams } from "../../domain/dto/user.dto";
import { InvalidOperationError, NonExistentResourceError } from "../../domain/error";
import { findAccount } from "./accounts.service";
import logger from "../../config/logger";

/**
 * This method will create a new user object with the given username and interests. A user can only be created for an
 * account that is not yet associated with a user profile.
 * @param actor Unique id of account that initiated the operation
 * @param uid Unique id of account to associate with new user
 * @param payload Values to initialize new user
 * @returns User object
 */
export const createUser = async (actor: string, uid: string, payload: CreateUserPayload): Promise<User> => {
    // Locate associated account
    const account = await findAccount(actor, { uid });
    if (!account) throw new InvalidOperationError('Cannot create user for nonexistent account');
    const userExists = await findUserExists(actor, { uid });
    if (userExists) throw new InvalidOperationError('Account is already associated with another user');
    const usernameExists = await findUserExists(actor, { username: payload.username });
    if (usernameExists) throw new InvalidOperationError(`User already exists with username: ${payload.username}`);
    await UserModel.create({
        uid: account.uid,
        username: payload.username,
        interests: payload.interests
    });
    const user = await findUser(actor, { uid: account.uid });
    if (!user) throw new NonExistentResourceError("user", account.uid);
    logger.info({
        operation: "createUser",
        actor,
        payload,
        resource: `user:${account.uid}`
    });
    return user;
}

/**
 * This method will return an array of users, pagination is enabled via offset & limit.
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @param offset Number of users to offset
 * @param limit Number of users to return
 * @returns An array of users
 */
export const findUsers = async (actor: string, params: UserSearchParams, offset?: number, limit?: number): Promise<User[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const users = await UserModel.find(params).skip(off).limit(lim).select('-_id -__v').lean();
    logger.info({
        operation: "findUsers",
        actor,
        params,
        additionalParams: { offset, limit }
    });
    return users;
}

/**
 * This method will return a user with the given uid, or undefined if one cannot be found.
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @returns UserDTO or undefined
 */
export const findUser = async (actor: string, params: UserSearchParams): Promise<User> => {
    const user = await UserModel.findOne(params).select('-_id -__v').lean();
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    logger.info({
        operation: "findUser",
        actor,
        params,
        resource: `user:${user.uid}`
    });
    return user;
}

/**
 * This method will determine if a user exists with a given uid
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @returns True if a user exists with that uid
 */
export const findUserExists = async (actor: string, params: UserSearchParams): Promise<Boolean> => {
    const user = await UserModel.findOne(params).select('uid').lean();
    if (user == undefined) return false;
    logger.info({
        operation: "findUserExists",
        actor,
        params,
        resource: `user:${user.uid}`
    });
    return true;
}

/**
 * This method will change the username of a given user
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @param username New username
 * @returns True if the update was successful
 */
export const updateUsername = async (actor: string, params: UserSearchParams, username: string): Promise<Boolean> => {
    const user = await UserModel.findOne(params).select('uid username dateModified');
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    if (user.username === username) throw new InvalidOperationError("New username must be different from current");
    user.username = username;
    user.dateModified = new Date(Date.now());
    await user.save();
    logger.info({
        operation: "updateUsername",
        actor,
        params,
        additionalParams: { username },
        resource: `user:${user.uid}`,
    });
    return true;
}

/**
 * This method will delete a UserModel. Any user will be automatically deleted
 * when the associated account deleted.
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @returns True if the delete was successful
 */
export const deleteUser = async (actor: string, params: UserSearchParams): Promise<Boolean> => {
    const user = await UserModel.findOne(params).select('uid');
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    await user.deleteOne();
    logger.info({
        operation: "deleteUser",
        actor,
        params,
        resource: `user:${user.uid}`,
    });
    return true;
}

// ---- User Interests --------

/**
 * This method will return a user's interests
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @returns Array of tags
 */
export const findUserInterests = async (actor: string, params: UserSearchParams): Promise<string[]> => {
    const user = await UserModel.findOne(params).select('uid interests').lean();
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    logger.info({
        operation: "findUserInterests",
        actor,
        params,
        resource: `user:${user.uid}`
    });
    return user.interests;
}

/**
 * This method will add one or more interests to a given user
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @param add Array of tags to add as interests
 * @returns Array of tags
 */
export const addUserInterests = async (actor: string, params: UserSearchParams, add: string[]): Promise<Boolean> => {
    const user = await UserModel.findOne(params).select('uid interests dateModified');
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    if (add.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    add.forEach((a) => {
        user.interests.push(a);
    });
    user.dateModified = new Date(Date.now());
    await user.save();
    logger.info({
        operation: "addUserInterests",
        actor,
        params,
        additionalParams: { add },
        resource: `user:${user.uid}`
    });
    return true;
}

/**
 * This method will remove one or more interests to a given user
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @param add Array of tags to remove as interests
 * @returns True if the update was successful
 */
export const removeUserInterests = async (actor: string, params: UserSearchParams, remove: string[]): Promise<Boolean> => {
    const user = await UserModel.findOne(params).select('uid interests dateModified');
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    if (remove.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    user.interests = user.interests.filter((i) => {
        return (!remove.includes(i));
    })
    user.dateModified = new Date(Date.now());
    await user.save();
    logger.info({
        operation: "removeUserInterests",
        actor,
        params,
        additionalParams: { remove },
        resource: `user:${user.uid}`
    });
    return true;
}

// ---- User Friends --------

/**
 * This method will return a user's friends
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @returns Array of connection id's
 */
export const findUserFriends = async (actor: string, params: UserSearchParams): Promise<string[]> => {
    const user = await UserModel.findOne(params).select('uid friends').lean();
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    logger.info({
        operation: "findUserFriends",
        actor,
        params,
        resource: `user:${user.uid}`
    });
    return user.friends;
}

// ---- User Groups --------

/**
 * This method will return a user's groups
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @returns Array of connection id's
 */
export const findUserGroups = async (actor: string, params: UserSearchParams): Promise<string[]> => {
    const user = await UserModel.findOne(params).select('uid groups').lean();
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    logger.info({
        operation: "findUserGroups",
        actor,
        params,
        resource: `user:${user.uid}`
    });
    return user.groups;
}

// ---- User Inbox --------

/**
 * This method will return the inbox of the given user
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @returns Array of notification id's
 */
export const findUserInbox = async (actor: string, params: UserSearchParams): Promise<String[]> => {
    const user = await UserModel.findOne(params).select('uid inbox').lean();
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    logger.info({
        operation: "findUserInbox",
        actor,
        params,
        resource: `user:${user.uid}`
    });
    return user.inbox;
}

/**
 * This method will add a notification id to a user's inbox
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate user by
 * @param note Notification's unique id
 * @returns True if operation was successful
 */
export const addToUserInbox = async (actor: string, params: UserSearchParams, note: string): Promise<Boolean> => {
    const user = await UserModel.findOne(params).select('uid inbox dateModified');
    if (!user) throw new NonExistentResourceError("user", JSON.stringify(params));
    user.inbox.push(note);
    await user.save();
    logger.info({
        operation: "addToUserInbox",
        actor,
        params,
        additionalParams: { note },
        resource: `user:${user.uid}`
    });
    return true;
}
