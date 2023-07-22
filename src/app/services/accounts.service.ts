import bcrypt from "bcrypt";
import { Account } from "../../domain/domain";
import { NonExistentResourceError } from "../../domain/models/error";
import { IAccount, UpdateAccountPayload } from "../../domain/models/account";

// ---- Utility ------------

/**
 * This method will sanitize the given data and return an IAccount object
 * @param data Object to be sanitized
 * @returns IAccount object
 */
export const sanitizeAccountResponse = (data: any): IAccount => {
    const account: IAccount = {
        uid: data.uid,
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        birthday: data.birthday,
        verified: data.verified,
        locked: data.locked,
        last_login: data.last_login,
        created: data.created,
        modified: data.modified
    };
    return account;
}

// ---- Account ------------

/**
 * This method returns an array of accounts
 * @param actor Unique id of user who initiated operation
 * @returns An array of accounts
 */
export const findAccounts = async (actor: string, offset?: number, limit?: number): Promise<[IAccount?]> => {
    let results = [];
    if (offset && limit) results = await Account.find().skip(offset).limit(limit);
    else if (offset && !limit) results = await Account.find().skip(offset);
    else if (!offset && limit) results = await Account.find().limit(limit);
    else results = await Account.find();

    let accounts: [IAccount?] = [];
    results.forEach((result) => {
        accounts.push(sanitizeAccountResponse(result));
    });
    return accounts;
}

/**
 * This method returns a single account by its ID
 * @param actor Unique id of user who initiated operation
 * @param uid Unique id of requested account
 * @returns Account with matching unique id
 */
export const findAccount = async (actor: string, uid: string): Promise<IAccount | undefined> => {
    const account = await Account.findOne({ uid });
    if (!account) return undefined;
    return sanitizeAccountResponse(account);
}

/**
 * This method returns a single account by its email
 * @param actor Unique id of user who initiated operation
 * @param email Email of requested account
 * @returns Account with matching email
 */
export const findAccountByEmail = async (actor: string, email: string): Promise<IAccount | undefined> => {
    const account = await Account.findOne({ email });
    if (!account) return undefined;
    return sanitizeAccountResponse(account);
}

/**
 * This method determines if an account exists with the given id
 * @param actor Unique id of user who initiated operation
 * @param uid Unique id to check
 * @returns True if an account exists with unique id, otherwise false
 */
export const findAccountExistsWithUid = async (actor: string, uid: string): Promise<Boolean> => {
    const result = await Account.exists({ uid });
    return (result != undefined);
}

/**
 * This method determines if an account exists with the given email
 * @param actor Unique id of user who initiated operation
 * @param email Email to check
 * @returns True if an account exists with email, otherwise false
 */
export const findAccountExistsWithEmail = async (actor: string, email: string): Promise<Boolean> => {
    const result = await Account.exists({ email });
    return (result != undefined);
}

/**
 * This method updates a single account. It is capable of dynamically updating one or more fields.
 * @param actor Unique id of user who initiated operation
 * @param uid ID of account to update
 * @param payload Update account payload
 * @returns The updated account
 */
export const updateAccount = async (actor: string, uid: string, payload: UpdateAccountPayload): Promise<IAccount> => {
    const account = await Account.findOne({ uid });
    if (!account) throw new NonExistentResourceError("Account", uid);
    if (payload.email) account.email = payload.email;
    if (payload.password) {
        const encrypted = bcrypt.hashSync(payload.password, bcrypt.genSaltSync());
        account.password = encrypted;
    }
    if (payload.name) account.name = payload.name;
    if (payload.phone) account.phone = payload.phone;
    if (payload.birthday) account.birthday = payload.birthday;
    if (account.isModified()) account.modified = new Date(Date.now());
    const saved = await account.save();
    return sanitizeAccountResponse(saved);
}

/**
 * This method deletes a single account
 * @param actor Unique id of user who initiated operation
 * @param id ID of account to delete
 * @returns The deleted account
 */
export const deleteAccount = async (actor: string, uid: string): Promise<Boolean> => {
    const result = await Account.deleteOne({ uid });
    return (result.acknowledged && (result.deletedCount == 1));
}
