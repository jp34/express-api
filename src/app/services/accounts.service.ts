import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Account, AccountModel } from "../../domain/entity/account";
import { InvalidOperationError, NonExistentResourceError } from "../../domain/error";
import logger from "../../config/logger";
import { CreateAccountPayload, AccountSearchParams } from "../../domain/dto/account.dto";

/**
 * This method will create a new account given a valid payload is provided.
 * @param actor IP address of device that initiated operation
 * @param payload Values to create new account with
 * @returns The newly created account
 */
export const createAccount = async (actor: string, payload: CreateAccountPayload): Promise<Account> => {
    const emailCheck = await findAccountExists(actor, { email: payload.email });
    if (emailCheck) throw new InvalidOperationError(`Account already exists with email: ${payload.email}`);
    const uid = v4();
    const encrypted = bcrypt.hashSync(payload.password, bcrypt.genSaltSync());
    await AccountModel.create({
        uid: uid,
        email: payload.email.toLowerCase(),
        password: encrypted,
        name: payload.name,
        phone: payload.phone,
        birthday: payload.birthday
    });
    const account = await findAccount(actor, { uid });
    if (!account) throw new NonExistentResourceError("account", uid);
    logger.info({
        operation: "createAccount",
        actor,
        payload,
        resource: `account:${account.uid}`
    });
    return account;
}

/**
 * This method will locate and return all accounts matching the provided search
 * parameters. Unless specified it will default to a response size of 10
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @param offset Number of documents to offset response (Defaults to 0)
 * @param limit Number of documents to return (Defaults to 10)
 * @returns An array of accounts
 */
export const findAccounts = async (actor: string, params: AccountSearchParams, offset?: number, limit?: number): Promise<Account[]> => {
    const off = offset ?? 0;
    const lim = limit ?? 10;
    const accounts = await AccountModel.find(params).skip(off).limit(lim).select('-_id -__v').lean();
    logger.info({
        operation: "findAccounts",
        actor,
        params,
        additionalParams: { offset, limit }
    });
    return accounts;
}

/**
 * This method will locate an account using the provided search parameters. If it
 * cannot find a matching account it will return undefined.
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @returns Account object or undefined
 */
export const findAccount = async (actor: string, params: AccountSearchParams): Promise<Account | undefined> => {
    const account = await AccountModel.findOne(params).select('-_id -__v').lean();
    if (!account) throw new NonExistentResourceError("account", JSON.stringify(params));
    logger.info({
        operation: "findAccount",
        actor,
        params,
        resource: `account:${account.uid}`
    });
    return account;
}

/**
 * This method will determine if an account exists with the matching parameters.
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @returns True if a matching account exists, otherwise false
 */
export const findAccountExists = async (actor: string, params: AccountSearchParams): Promise<Boolean> => {
    const account = await AccountModel.findOne(params).select('uid').lean();
    if (account == undefined) return false;
    logger.info({
        operation: "findAccountExists",
        actor,
        params,
        resource: `account:${account.uid}`
    });
    return true;
}

/**
 * This method will determine if an account has an associated user. Relies on hasUser
 * field of Account object being up to date.
 * @param actor Unique if of account that initiated the operation
 * @param params Parameters to locate account by
 * @returns True if account is associated with a user, otherwise false
 */
export const findAccountHasUser = async (actor: string, params: AccountSearchParams): Promise<Boolean> => {
    const account = await AccountModel.findOne(params).select('uid hasUser').lean();
    if (!account) throw new NonExistentResourceError("account", JSON.stringify(params));
    logger.info({
        operation: "findAccountHasUser",
        actor,
        params,
        resource: `account:${account.uid}`
    });
    return account.hasUser;
}

/**
 * This method will update the email of the given account
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @param email New email
 * @returns True if update was successful, otherwise false
 */
export const updateAccountEmail = async (actor: string, params: AccountSearchParams, email: string): Promise<Boolean> => {
    const account = await AccountModel.findOne(params).select('uid email dateModified');
    if (!account) throw new NonExistentResourceError("account", JSON.stringify(params));
    const exists = await findAccountExists(actor, { email: email.toLowerCase() });
    if (exists) throw new InvalidOperationError(`Account already exists with email: ${email}`);
    account.email = email.toLowerCase();
    account.dateModified = new Date(Date.now());
    await account.save();
    logger.info({
        operation: "updateAccountPassword",
        actor,
        params,
        additionalParams: { email },
        resource: `account:${account.uid}`
    });
    return true;
}

/**
 * This method will update the password of the given account
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @param password New password
 * @returns True if update was successful, otherwise false
 */
export const updateAccountPassword = async (actor: string, params: AccountSearchParams, password: string): Promise<Boolean> => {
    const account = await AccountModel.findOne(params).select('uid password dateModified');
    if (!account) throw new NonExistentResourceError('account', JSON.stringify(params));
    const encrypted = bcrypt.hashSync(password, bcrypt.genSaltSync());
    account.password = encrypted;
    account.dateModified = new Date(Date.now());
    await account.save();
    logger.info({
        operation: "updateAccountPassword",
        actor,
        params,
        additionalParams: { password },
        resource: `account:${account.uid}`
    });
    return true;
}

/**
 * This method will update the name of the given account
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @param name New name
 * @returns True if update was successful, otherwise false
 */
export const updateAccountName = async (actor: string, params: AccountSearchParams, name: string): Promise<Boolean> => {
    const account = await AccountModel.findOne(params).select('uid name dateModified');
    if (!account) throw new NonExistentResourceError('account', JSON.stringify(params));
    account.name = name;
    account.dateModified = new Date(Date.now());
    await account.save();
    logger.info({
        operation: "updateAccountName",
        actor,
        params,
        additionalParams: { name },
        resource: `account:${account.uid}`
    });
    return true;
}

/**
 * This method will update the phone of the given account
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @param phone New phone
 * @returns True if update was successful, otherwise false
 */
export const updateAccountPhone = async (actor: string, params: AccountSearchParams, phone: string): Promise<Boolean> => {
    const account = await AccountModel.findOne(params).select('uid phone dateModified');
    if (!account) throw new NonExistentResourceError('account', JSON.stringify(params));
    const exists = await findAccountExists(actor, { phone });
    if (exists) throw new InvalidOperationError(`Account already exists with phone: ${phone}`);
    account.phone = phone;
    account.dateModified = new Date(Date.now());
    await account.save();
    logger.info({
        operation: "updateAccountPhone",
        actor,
        params,
        additionalParams: { phone },
        resource: `account:${account.uid}`
    });
    return true;
}

/**
 * This method will update the birthday of the given account
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @param birthday New birthday
 * @returns True if update was successful, otherwise false
 */
export const updateAccountBirthday = async (actor: string, params: AccountSearchParams, birthday: string): Promise<Boolean> => {
    const account = await AccountModel.findOne(params).select('uid birthday dateModified');
    if (!account) throw new NonExistentResourceError("account", JSON.stringify(params));
    account.birthday = birthday;
    account.dateModified = new Date(Date.now());
    await account.save();
    logger.info({
        operation: "updateAccountBirthday",
        actor,
        params,
        additionalParams: { birthday },
        resource: `account:${account.uid}`
    });
    return true;
}

/**
 * This method will update the boolean value hasUser on a given account object. This field designates whether
 * a user profile has been associated with an account
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @param hasUser New value for account's hasUser attribute
 * @returns True if the update was successful, otherwise false
 */
export const updateAccountHasUser = async (actor: string, params: AccountSearchParams, hasUser: boolean): Promise<Boolean> => {
    const account = await AccountModel.findOne(params).select('uid hasUser dateModified');
    if (!account) throw new NonExistentResourceError("account", JSON.stringify(params));
    account.hasUser = hasUser;
    account.dateModified = new Date(Date.now());
    await account.save();
    logger.info({
        operation: "updateAccountHasUser",
        actor,
        params,
        additionalParams: { hasUser },
        resource: `account:${account.uid}`
    });
    return true;
}

/**
 * This method deletes a single account
 * @param actor Unique id of account that initiated the operation
 * @param params Parameters to locate account by
 * @returns True if the account was successfully deleted
 */
export const deleteAccount = async (actor: string, params: AccountSearchParams): Promise<Boolean> => {
    const account = await AccountModel.findOne(params).select('uid');
    if (!account) throw new NonExistentResourceError("account", JSON.stringify(params));
    if (account.hasUser) throw new InvalidOperationError("Cannot delete an account that has an associated user profile");
    await account.deleteOne();
    logger.info({
        operation: "deleteAccount",
        actor,
        params,
        resource: `account:${account.uid}`
    });
    return true;
}
