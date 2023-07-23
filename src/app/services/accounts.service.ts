import bcrypt from "bcrypt";
import { AccountModel, AccountDTO, toAccountDTO } from "../../domain/entity/account";
import { InvalidOperationError } from "../../domain/error";

/**
 * This method returns an array of accounts
 * @param actor Unique id of account that initiated the operation
 * @returns An array of accounts
 */
export const findAccounts = async (actor: string, offset?: number, limit?: number): Promise<AccountDTO[]> => {
    let results = [];
    if (offset && limit) results = await AccountModel.find().skip(offset).limit(limit);
    else if (offset && !limit) results = await AccountModel.find().skip(offset);
    else if (!offset && limit) results = await AccountModel.find().limit(limit);
    else results = await AccountModel.find();
    let accounts: AccountDTO[] = [];
    results.forEach((result) => {
        accounts.push(toAccountDTO(result));
    });
    return accounts;
}

/**
 * This method returns a single account by its ID
 * @param actor Unique id of account that initiated the operation
 * @param uid Unique id of requested account
 * @returns Account with matching unique id
 */
export const findAccount = async (actor: string, uid: string): Promise<AccountDTO | undefined> => {
    const account = await AccountModel.findOne({ uid });
    if (!account) return undefined;
    return toAccountDTO(account);
}

/**
 * This method returns a single account by its email
 * @param actor Unique id of account that initiated the operation
 * @param email Email of requested account
 * @returns Account with matching email
 */
export const findAccountByEmail = async (actor: string, email: string): Promise<AccountDTO | undefined> => {
    const account = await AccountModel.findOne({ email });
    if (!account) return undefined;
    return toAccountDTO(account);
}

/**
 * This method determines if an account exists with the given id
 * @param actor Unique id of account that initiated the operation
 * @param uid Unique id to check
 * @returns True if an account exists with unique id, otherwise false
 */
export const accountExists = async (actor: string, uid: string): Promise<Boolean> => {
    const result = await AccountModel.exists({ uid });
    return (result != undefined);
}

/**
 * This method determines if an account exists with the given email
 * @param actor Unique id of account that initiated the operation
 * @param email Email address to check
 * @returns True if an account exists with email, otherwise false
 */
export const accountExistsWithEmail = async (actor: string, email: string): Promise<Boolean> => {
    const result = await AccountModel.exists({ email });
    return (result != undefined);
}

/**
 * This method determines if 
 * @param actor Unique id of account that initiated the operation
 * @param phone Phone number to check
 * @returns Account object associated with phone number
 */
export const accountExistsWithPhone = async (actor: string, phone: string): Promise<Boolean> => {
    const result = await AccountModel.exists({ phone });
    return (result != undefined);
}

/**
 * This method will update the email of the given account
 * @param actor Unique id of account that initiated the operation
 * @param account Unique id of the account to update
 * @param email New email
 * @returns True if update was successful, otherwise false
 */
export const updateAccountEmail = async (actor: string, account: string, email: string): Promise<Boolean> => {
    const a = await AccountModel.findOne({ uid: account });
    if (!a) throw new InvalidOperationError(`Account does not exist: ${account}`);
    const exists = await accountExistsWithEmail(actor, email);
    if (exists) throw new InvalidOperationError(`Account already exists with email: ${email}`);
    a.email = email;
    await a.save();
    return true;
}

/**
 * This method will update the password of the given account
 * @param actor Unique id of account that initiated the operation
 * @param account Unique id of the account to update
 * @param password New password
 * @returns True if update was successful, otherwise false
 */
export const updateAccountPassword = async (actor: string, account: string, password: string): Promise<Boolean> => {
    const a = await AccountModel.findOne({ uid: account });
    if (!a) throw new InvalidOperationError(`Account does not exist: ${account}`);
    const encrypted = bcrypt.hashSync(password, bcrypt.genSaltSync());
    a.password = encrypted;
    await a.save();
    return true;
}

/**
 * This method will update the name of the given account
 * @param actor Unique id of account that initiated the operation
 * @param account Unique id of the account to update
 * @param name New name
 * @returns True if update was successful, otherwise false
 */
export const updateAccountName = async (actor: string, account: string, name: string): Promise<Boolean> => {
    const a = await AccountModel.findOne({ uid: account });
    if (!a) throw new InvalidOperationError(`Account does not exist: ${account}`);
    a.name = name;
    await a.save();
    return true;
}

/**
 * This method will update the phone of the given account
 * @param actor Unique id of account that initiated the operation
 * @param account Unique id of the account to update
 * @param phone New phone
 * @returns True if update was successful, otherwise false
 */
export const updateAccountPhone = async (actor: string, account: string, phone: string): Promise<Boolean> => {
    const a = await AccountModel.findOne({ uid: account });
    if (!a) throw new InvalidOperationError(`Account does not exist: ${account}`);
    const exists = await accountExistsWithPhone(actor, phone);
    if (exists) throw new InvalidOperationError(`Account already exists with phone: ${phone}`);
    a.phone = phone;
    await a.save();
    return true;
}

/**
 * This method will update the birthday of the given account
 * @param actor Unique id of account that initiated the operation
 * @param account Unique id of the account to update
 * @param birthday New birthday
 * @returns True if update was successful, otherwise false
 */
export const updateAccountBirthday = async (actor: string, account: string, birthday: string): Promise<Boolean> => {
    const a = await AccountModel.findOne({ uid: account });
    if (!a) throw new InvalidOperationError(`Account does not exist: ${account}`);
    a.birthday = birthday;
    await a.save();
    return true;
}

/**
 * This method will update the verified status of the given account
 * @param actor Unique id of account that initiated the operation
 * @param account Unique id of the account to update
 * @param verified New verified status
 * @returns True if update was successful, otherwise false
 */
export const updateAccountVerified = async (actor: string, account: string, verified: boolean): Promise<Boolean> => {
    const a = await AccountModel.findOne({ uid: account });
    if (!a) throw new InvalidOperationError(`Account does not exist: ${account}`);
    a.verified = verified;
    await a.save();
    return true;
}

/**
 * This method will update the locked status of the given account
 * @param actor Unique id of account that initiated the operation
 * @param account Unique id of the account to update
 * @param verified New locked status
 * @returns True if update was successful, otherwise false
 */
export const updateAccountLocked = async (actor: string, account: string, locked: boolean): Promise<Boolean> => {
    const a = await AccountModel.findOne({ uid: account });
    if (!a) throw new InvalidOperationError(`Account does not exist: ${account}`);
    a.locked = locked;
    await a.save();
    return true;
}

/**
 * This method deletes a single account
 * @param actor Unique id of account that initiated the operation
 * @param id ID of account to delete
 * @returns The deleted account
 */
export const deleteAccount = async (actor: string, uid: string): Promise<Boolean> => {
    const result = await AccountModel.deleteOne({ uid });
    return (result.acknowledged && (result.deletedCount == 1));
}
