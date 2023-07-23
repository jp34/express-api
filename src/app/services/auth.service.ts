import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { InvalidOperationError } from "../../domain/entity/error";
import { sanitizeAccountResponse, accountExistsWithEmail, findAccountByEmail } from "./accounts.service";
import { AccountModel, Account } from "../../domain/entity/account";
import { RegistrationPayload, AuthenticationPayload } from "../../domain/entity/auth";
import logger from "../../config/logger";
import { ServerError } from "../../domain/entity/error";

/**
 * This method will register a new account using the provided data
 * @param actor Unique id of account that initiated the operation
 * @param data RegistrationPayload object
 * @returns AccountResponse if registration was successful
 */
export const register = async (actor: string, data: RegistrationPayload): Promise<Account> => {
    // Validate user does not already exist
    const exists = await accountExistsWithEmail(actor, data.email);
    if (exists) throw new InvalidOperationError(`Account already exists with email(${data.email})`);

    // Create new account
    const uid = v4();
    const encrypted = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
    const account = await AccountModel.create({
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
 * @param actor Unique id of account that initiated the operation
 * @param data AuthenticationPayload object
 * @returns AccountResponse if authentication was successful
 */
export const authenticate = async (actor: string, data: AuthenticationPayload): Promise<Account> => {
    const account = await findAccountByEmail(actor, data.identifier);
    if (!account) throw new InvalidOperationError("Account does not exist");
    const valid = await bcrypt.compare(data.password, account.password);
    if (!valid) throw new InvalidOperationError("Invalid credentials provided");
    return sanitizeAccountResponse(account);
}
