import { User, UserModel, CreateUserPayload } from "../../domain/entity/user";
import { InvalidOperationError, NonExistentResourceError } from "../../domain/error";
import { findAccount } from "./accounts.service";

// ---- Create Methods ------------

/**
 * This method will create a new user object with the given username and interests. A user can only be created for an
 * account that is not yet associated with a user profile.
 * @param actor Unique id of account that initiated the operation
 * @param uid Unique id of the account to associate with the new user
 * @param data Create user payload
 * @returns User object
 */
export const createUser = async (actor: string, uid: string, data: CreateUserPayload): Promise<User> => {
    const account = await findAccount(actor, uid);
    if (!account) throw new InvalidOperationError('Cannot create user for nonexistent account');
    const user = await UserModel.findOne({ uid: account.uid });
    if (user) throw new InvalidOperationError('User already exists');
    return await UserModel.create({
        uid: account.uid,
        username: data.username,
        interests: data.interests
    });
}

/**
 * This method will add one or more interests to a given user
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @param add Array of tags to add as interests
 * @returns Array of tags
 */
export const addUserInterests = async (actor: string, uid: string, add: string[]): Promise<Boolean> => {
    const user = await UserModel.findOne({ uid });
    if (!user) throw new NonExistentResourceError("user", uid);
    if (add.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    add.forEach((a) => {
        user.interests.push(a);
    });
    user.dateModified = new Date(Date.now());
    const saved = await user.save();
    return true;
}

// ---- Read Methods ------------

/**
 * This method will return an array of users, pagination is enabled via offset & limit.
 * @param actor Unique id of account that initiated the operation
 * @param offset Number of users to offset
 * @param limit Number of users to return
 * @returns An array of users
 */
export const findUsers = async (actor: string, offset?: number, limit?: number): Promise<User[]> => {
    let results = [];
    if (offset && limit) results = await UserModel.find().skip(offset).limit(limit);
    else if (offset && !limit) results = await UserModel.find().skip(offset);
    else if (!offset && limit) results = await UserModel.find().limit(limit);
    else results = await UserModel.find();
    let users: User[] = [];
    results.forEach((result) => {
        users.push(result);
    });
    return users;
}

/**
 * This method will return a user with the given uid, or undefined if one cannot be found.
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @returns UserDTO or undefined
 */
export const findUser = async (actor: string, uid: string): Promise<User> => {
    const user = await UserModel.findOne({ uid });
    if (!user) throw new NonExistentResourceError("user", uid);
    return user;
}

/**
 * This method will locate and return a user by its username if it exists
 * @param actor Unique id of account that initiated the operation
 * @param uidname Username to search for
 * @returns UserDTO or undefined
 */
export const findUserByUsername = async (actor: string, username: string): Promise<User> => {
    const user = await UserModel.findOne({ username });
    if (!user) throw new NonExistentResourceError("user", username);
    return user;
}

/**
 * This method will determine if a user exists with a given uid
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @returns True if a user exists with that uid, otherwise false
 */
export const userExists = async (actor: string, uid: string): Promise<Boolean> => {
    const result = await UserModel.exists({ uid });
    return (result != undefined);
}

/**
 * This method will determine if a user exists with a given username
 * @param actor Unique id of account that initiated the operation
 * @param uidname Username to check
 * @returns True if a user exists with that username, otherwise false
 */
export const userExistsWithUsername = async (actor: string, username: string): Promise<Boolean> => {
    const result = await UserModel.exists({ username });
    return (result != undefined);
}

/**
 * This method will return a user's interests
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @returns Array of tags
 */
export const findUserInterests = async (actor: string, user: string): Promise<string[]> => {
    const u = await findUser(actor, user);
    if (!u) throw new NonExistentResourceError("user", user);
    return u.interests;
}

/**
 * This method will return a user's friends
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @returns Array of connection id's
 */
export const findUserFriends = async (actor: string, user: string): Promise<string[]> => {
    const u = await findUser(actor, user);
    if (!u) throw new NonExistentResourceError("user", user);
    return u.friends;
}

/**
 * This method will return a user's groups
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @returns Array of connection id's
 */
export const findUserGroups = async (actor: string, user: string): Promise<string[]> => {
    const u = await findUser(actor, user);
    if (!u) throw new NonExistentResourceError("user", user);
    return u.groups;
}

/**
 * This method will return the inbox of the given user
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @returns Array of notification id's
 */
export const findUserInbox = async (actor: string, user: string): Promise<String[]> => {
    const u = await findUser(actor, user);
    if (!u) throw new NonExistentResourceError("user", user);
    return u.inbox;
}

// ---- Update Methods ------------

/**
 * This method will change the username of a given user
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @param newname New username
 * @returns True if the name change was successful, otherwise false
 */
export const updateUsername = async (actor: string, uid: string, newname: string): Promise<Boolean> => {
    const user = await UserModel.findOne({ uid });
    if (!user) throw new NonExistentResourceError("user", uid);
    if (user.username === newname) throw new InvalidOperationError("New username must be different from current");
    user.username = newname;
    user.dateModified = new Date(Date.now());
    await user.save();
    return true;
}

/**
 * This method will add a notification id to a user's inbox
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @param noteId Notification's unique id
 * @returns True if operation was successful, otherwise false
 */
export const addToUserInbox = async (actor: string, user: string, note: string): Promise<Boolean> => {
    const u = await UserModel.findOne({ uid: user });
    if (!u) throw new NonExistentResourceError("user", user);
    u.inbox.push(note);
    await u.save();
    return true;
}

// ---- Delete Methods ------------

/**
 * This method will delete a UserModel. Any user will be automatically deleted
 * when the associated account deleted.
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @returns True if the delete was successful, otherwise false
 */
export const deleteUser = async (actor: string, uid: string): Promise<Boolean> => {
    const result = await UserModel.deleteOne({ uid });
    return (result.acknowledged && (result.deletedCount == 1));
}

/**
 * This method will remove one or more interests to a given user
 * @param actor Unique id of account that initiated the operation
 * @param uid User's unique id
 * @param add Array of tags to remove as interests
 * @returns Array of tags
 */
export const removeUserInterests = async (actor: string, user: string, remove: string[]): Promise<Boolean> => {
    const u = await UserModel.findOne({ uid: user });
    if (!u) throw new NonExistentResourceError("user", user);
    if (remove.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    u.interests = u.interests.filter((i) => {
        return !remove.includes(i);
    })
    u.dateModified = new Date(Date.now());
    await u.save();
    return true;
}
