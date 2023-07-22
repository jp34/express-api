import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Account } from "../../domain/domain";
import { InvalidOperationError } from "../../domain/models/error";
import { sanitizeAccountResponse, findAccountExistsWithEmail, findAccount, findAccountByEmail } from "./accounts.service";
import { IAccount } from "../../domain/models/account";
import { RegistrationPayload, AuthenticationPayload } from "../../domain/models/auth";
import logger from "../../config/logger";
import { ServerError } from "../../domain/models/error";

/**
 * This method will register a new account using the provided data
 * @param actor Unique id of user who initiated operation
 * @param data RegistrationPayload object
 * @returns AccountResponse if registration was successful
 */
export const register = async (actor: string, data: RegistrationPayload): Promise<IAccount> => {
    // Validate user does not already exist
    const exists = await findAccountExistsWithEmail(actor, data.email);
    if (exists) throw new InvalidOperationError(`Account already exists with email(${data.email})`);

    // Create new account
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
    if (!account) {
        logger.warn('Registration attempt failed to create account', { uid });
        throw new ServerError('Registration attempt failed');
    }
    return sanitizeAccountResponse(account);
}

/**
 * This method will authenticate an account using the given credentials
 * @param actor Unique id of user who initiated operation
 * @param data AuthenticationPayload object
 * @returns AccountResponse if authentication was successful
 */
export const authenticate = async (actor: string, data: AuthenticationPayload): Promise<IAccount> => {
    const account = await findAccountByEmail(actor, data.identifier);
    if (!account) throw new InvalidOperationError("Account does not exist");
    const valid = await bcrypt.compare(data.password, account.password);
    if (!valid) throw new InvalidOperationError("Invalid credentials provided");
    return sanitizeAccountResponse(account);
}
