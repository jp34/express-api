import bcrypt from "bcrypt";
import { Account } from "../../config/db";
import { NonExistentResourceError } from "../models/error";
import { UpdateAccountPayload } from "../models/io";
import { IAccount } from "../models/account";

// -- CREATE

/**
 * This method creates a new account
 * @param email Email address
 * @param password Password
 * @param firstName First name
 * @param lastName Last name
 * @param birthday Birthday
 * @returns The newly created Account
 */
export const createAccount = async (email: string, password: string, username: string, phone: string, birthday: string) => {
    const encrypted = bcrypt.hashSync(password, bcrypt.genSaltSync());
    return await Account.create({
        email: email,
        password: encrypted,
        username: username,
        phone: phone,
        birthday: birthday
    });
}

// -- READ

/**
 * This method returns an array of accounts
 * @returns An array of accounts
 */
export const findAccounts = async (offset?: number, limit?: number) => {
    if (offset && limit) return await Account.find().skip(offset).limit(limit);
    else if (offset && !limit) return await Account.find().skip(offset);
    else if (!offset && limit) return await Account.find().limit(limit);
    else return await Account.find();
}

/**
 * This method returns a single account by its ID
 * @param id ID of requested account
 * @returns Account with matching ID
 */
export const findAccountById = async (id: string) => {
    return await Account.findById(id);
}

/**
 * This method returns a single account by its email
 * @param email Email of requested account
 * @returns Account with matching email
 */
export const findAccountByEmail = async (email: string) => {
    return await Account.findOne({ email: email });
}

/**
 * This method determines if an account exists with the given id
 * @param id ID to check
 * @returns True if an account exists with id, otherwise false
 */
export const findAccountExistsWithId = async (id: string) => {
    return await Account.exists({ _id: id });
}

/**
 * This method determines if an account exists with the given email
 * @param email Email to check
 * @returns True if an account exists with email, otherwise false
 */
export const findAccountExistsWithEmail = async (email: string) => {
    return await Account.exists({ email: email });
}

// -- UPDATE

/**
 * This method updates a single account. It is capable of dynamically updating one or more fields.
 * @param id ID of account to update
 * @param email New email
 * @param password New password
 * @param firstName New first name
 * @param lastName New last name
 * @param birthday New birthday
 * @returns The updated account
 */
export const updateAccount = async (id: string, payload: UpdateAccountPayload) => {
    const account = await Account.findById(id);
    if (account == undefined) throw new NonExistentResourceError("Account", id);

    if (payload.email) account.email = payload.email;
    if (payload.password) {
        const encrypted = bcrypt.hashSync(payload.password, bcrypt.genSaltSync());
        account.password = encrypted;
    }
    if (payload.username) account.username = payload.username;
    if (payload.phone) account.phone = payload.phone;
    if (payload.birthday) account.birthday = payload.birthday;
    return await account.save();
}

// -- DELETE

/**
 * This method deletes a single account
 * @param id ID of account to delete
 * @returns The deleted account
 */
export const deleteAccount = async (id: string) => {
    return await Account.deleteOne({ _id: id });
}
