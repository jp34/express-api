import { User } from "../../domain/domain";
import { InvalidOperationError, NonExistentResourceError } from "../../domain/models/error";
import { CreateUserPayload, IUser } from "../../domain/models/user";
import { findAccount } from "./accounts.service";

// ---- Utility ------------

/**
 * This method will sanatize the given data and return a new IUser object
 * @param data Object to be sanitized
 * @returns IUser object
 */
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
 * @param actor Unique id of user who initiated operation
 * @param uid Unique id of the account to associate with the new user
 * @param data Create user payload
 * @returns IUser object
 */
export const createUser = async (actor: string, uid: string, data: CreateUserPayload): Promise<IUser> => {
    const account = await findAccount(actor, uid);
    if (!account) throw new InvalidOperationError('Cannot create user for nonexistent account');
    const user = await User.findOne({ uid: account.uid });
    if (user) throw new InvalidOperationError('User already exists');
    const created = await User.create({
        uid: account.uid,
        username: data.username,
        interests: data.interests
    });
    return sanitizeUserResponse(created);
}

/**
 * This method will return an array of users, pagination is enabled via offset & limit.
 * @param actor Unique id of user who initiated operation
 * @param offset Number of users to offset
 * @param limit Number of users to return
 * @returns An array of users
 */
export const findUsers = async (actor: string, offset?: number, limit?: number): Promise<IUser[]> => {
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
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @returns IUser or undefined
 */
export const findUser = async (actor: string, user: string): Promise<IUser | undefined> => {
    const u = await User.findOne({ uid: user });
    if (!u) return undefined;
    return sanitizeUserResponse(u);
}

/**
 * This method will determine if a user exists with a given uid
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @returns True if a user exists with that uid, otherwise false
 */
export const userExists = async (actor: string, user: string): Promise<Boolean> => {
    const result = await User.exists({ uid: user });
    return (result != undefined);
}

/**
 * This method will determine if a user exists with a given username
 * @param actor Unique id of user who initiated operation
 * @param username Username to check
 * @returns True if a user exists with that username, otherwise false
 */
export const userExistsWithUsername = async (actor: string, username: string): Promise<Boolean> => {
    const result = await User.exists({ username });
    return (result != undefined);
}

/**
 * This method will change the username of a given user
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @param newname New username
 * @returns True if the name change was successful, otherwise false
 */
export const updateUsername = async (actor: string, user: string, newname: string): Promise<Boolean> => {
    const u = await User.findOne({ uid: user });
    if (!u) throw new NonExistentResourceError("User", user);
    if (u.username === newname) throw new InvalidOperationError("New username must be different from current");
    u.username = newname;
    u.modified = new Date(Date.now());
    await u.save();
    return true;
}

/**
 * This method will update a user's online status to the given status
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @param status New online status
 * @returns True if the update was successful, otherwise false
 */
export const updateOnlineStatus = async (actor: string, user: string, status: boolean): Promise<Boolean> => {
    const u = await User.findOne({ uid: user });
    if (!u) throw new NonExistentResourceError("User", user);
    u.online = status;
    await u.save();
    return true;
}

/**
 * This method will update a user's active status to the given status
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @param status New active status
 * @returns True if the update was successful, otherwise false
 */
export const updateActiveStatus = async (actor: string, user: string, status: boolean): Promise<Boolean> => {
    const u = await User.findOne({ uid: user });
    if (!u) throw new NonExistentResourceError("User", user);
    u.active = status;
    await u.save();
    return true;
}

/**
 * This method will delete a user. Any user will be automatically deleted
 * when the associated account deleted.
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @returns True if the delete was successful, otherwise false
 */
export const deleteUser = async (actor: string, user: string): Promise<Boolean> => {
    const result = await User.deleteOne({ uid: user });
    return (result.acknowledged && (result.deletedCount == 1));
}

// ---- User Interests ------------

/**
 * This method will add one or more interests to a given user
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @param add Array of tags to add as interests
 * @returns Array of tags
 */
export const addUserInterests = async (actor: string, user: string, add: string[]): Promise<string[]> => {
    const u = await User.findOne({ uid: user });
    if (!u) throw new NonExistentResourceError("User", user);
    if (add.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    add.forEach((a) => {
        u.interests.push(a);
    });
    const saved = await u.save();
    return sanitizeUserResponse(saved).interests;
}

/**
 * This method will return a user's interests
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @returns Array of tags
 */
export const findUserInterests = async (actor: string, user: string): Promise<string[]> => {
    const u = await findUser(actor, user);
    if (!u) throw new NonExistentResourceError("User", user);
    return u.interests;
}

/**
 * This method will remove one or more interests to a given user
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @param add Array of tags to remove as interests
 * @returns Array of tags
 */
export const removeUserInterests = async (actor: string, user: string, remove: string[]): Promise<string[]> => {
    const u = await User.findOne({ uid: user });
    if (!u) throw new NonExistentResourceError("User", user);
    if (remove.length <= 0) throw new InvalidOperationError("No user interests specified"); 
    u.interests = u.interests.filter((i) => {
        return !remove.includes(i);
    })
    const saved = await u.save();
    return sanitizeUserResponse(saved).interests;
}

// ---- User Friends ------------

/**
 * This method will return a user's friends
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @returns Array of connection id's
 */
export const findUserFriends = async (actor: string, user: string): Promise<string[]> => {
    const u = await findUser(actor, user);
    if (!u) throw new NonExistentResourceError("User", user);
    return u.friends;
}

// ---- User Groups ------------

/**
 * This method will return a user's groups
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @returns Array of connection id's
 */
export const findUserGroups = async (actor: string, user: string): Promise<string[]> => {
    const u = await findUser(actor, user);
    if (!u) throw new NonExistentResourceError("User", user);
    return u.groups;
}

// ---- User Inbox ----------------

/**
 * This method will return the inbox of the given user
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @returns Array of notification id's
 */
export const findUserInbox = async (actor: string, user: string): Promise<String[]> => {
    const u = await findUser(actor, user);
    if (!u) throw new NonExistentResourceError("User", user);
    return u.inbox;
}

/**
 * This method will add a notification id to a user's inbox
 * @param actor Unique id of user who initiated operation
 * @param user User's unique id
 * @param noteId Notification's unique id
 * @returns True if operation was successful, otherwise false
 */
export const addToUserInbox = async (actor: string, user: string, note: string): Promise<Boolean> => {
    const u = await User.findOne({ uid: user });
    if (!u) throw new NonExistentResourceError("User", user);
    u.inbox.push(note);
    await u.save();
    return true;
}
