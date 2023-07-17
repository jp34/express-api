import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Account } from "../../config/db";
import { InvalidOperationError, NonExistentResourceError } from "../models/error";
import { CreateAccountPayload, AccountResponse, UpdateAccountPayload } from "../models/account";

const sanitizeAccount = (data: any): AccountResponse => {
    const account: AccountResponse = {
        uid: data.uid,
        email: data.email,
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

/**
 * This method creates a new account
 * @param email Email address
 * @param password Password
 * @param name Name
 * @param username Username
 * @param phone Phone
 * @param birthday Birthday
 * @returns The newly created Account
 */
export const createAccount = async (data: CreateAccountPayload): Promise<AccountResponse> => {
    const uid = v4();
    const encrypted = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
    const account = await Account.create({
        uid: uid,
        email: data.email,
        password: encrypted,
        name: data.name,
        phone: data.phone,
        birthday: data.birthday
    });
    return sanitizeAccount(account);
}

/**
 * This method returns an array of accounts
 * @returns An array of accounts
 */
export const findAccounts = async (offset?: number, limit?: number): Promise<[AccountResponse?]> => {
    let results = [];
    if (offset && limit) results = await Account.find().skip(offset).limit(limit);
    else if (offset && !limit) results = await Account.find().skip(offset);
    else if (!offset && limit) results = await Account.find().limit(limit);
    else results = await Account.find();

    let accounts: [AccountResponse?] = [];
    results.forEach((result) => {
        accounts.push(sanitizeAccount(result));
    });
    return accounts;
}

/**
 * This method returns a single account by its ID
 * @param uid Unique id of requested account
 * @returns Account with matching unique id
 */
export const findAccountByUid = async (uid: string): Promise<AccountResponse> => {
    const account = await Account.findOne({ uid });
    return sanitizeAccount(account);
}

/**
 * This method returns a single account by its email
 * @param email Email of requested account
 * @returns Account with matching email
 */
export const findAccountByEmail = async (email: string): Promise<AccountResponse> => {
    const account = await Account.findOne({ email });
    return sanitizeAccount(account);
}

/**
 * This method determines if an account exists with the given id
 * @param uid Unique id to check
 * @returns True if an account exists with unique id, otherwise false
 */
export const findAccountExistsWithUid = async (uid: string): Promise<Boolean> => {
    const result = await Account.exists({ uid });
    return (result != undefined);
}

/**
 * This method determines if an account exists with the given email
 * @param email Email to check
 * @returns True if an account exists with email, otherwise false
 */
export const findAccountExistsWithEmail = async (email: string): Promise<Boolean> => {
    const result = await Account.exists({ email });
    return (result != undefined);
}

/**
 * This method updates a single account. It is capable of dynamically updating one or more fields.
 * @param uid ID of account to update
 * @param payload Update account payload
 * @returns The updated account
 */
export const updateAccount = async (uid: string, payload: UpdateAccountPayload): Promise<AccountResponse> => {
    const account = await Account.findOne({ uid });
    if (account == undefined) throw new NonExistentResourceError("Account", uid);
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
    return sanitizeAccount(saved);
}

/**
 * This method deletes a single account
 * @param id ID of account to delete
 * @returns The deleted account
 */
export const deleteAccount = async (uid: string): Promise<Boolean> => {
    const result = await Account.deleteOne({ uid });
    return (result.acknowledged && (result.deletedCount == 1));
}

export const validateCredentials = async (identifier: string, password: string): Promise<AccountResponse> => {
    const account = await Account.findOne({ email: identifier });
    if (!account) throw new InvalidOperationError("Account does not exist");
    const valid = await bcrypt.compare(password, account.password);
    if (!valid) throw new InvalidOperationError("Invalid credentials provided");
    return sanitizeAccount(account);
}

