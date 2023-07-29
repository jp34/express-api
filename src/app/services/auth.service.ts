import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { InvalidOperationError } from "../../domain/error";
import { accountExistsWithEmail, findAccount, findAccountByEmail } from "./accounts.service";
import { AccountDTO, AccountModel, toAccountDTO } from "../../domain/entity/account";
import { findUserByUsername } from "./users.service";
import { RegistrationPayload, AuthenticationPayload, AuthResponse } from "../../domain/auth";
import logger from "../../config/logger";
import { ServerError } from "../../domain/error";
import { generateTokenPair } from "./token.service";
import Regex from "../../domain/regex";

/**
 * This method will register a new account using the provided data
 * @param actor Unique id of account that initiated the operation
 * @param data RegistrationPayload object
 * @returns AccountResponse if registration was successful
 */
export const register = async (actor: string, data: RegistrationPayload): Promise<AuthResponse> => {
    // Validate user does not already exist
    const exists = await accountExistsWithEmail(actor, data.email);
    if (exists) throw new InvalidOperationError(`Account already exists with email(${data.email})`);

    // Create new account
    const uid = v4();
    const encrypted = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
    const a = await AccountModel.create({
        uid: uid,
        email: data.email.toUpperCase(),
        password: encrypted,
        name: data.name,
        phone: data.phone,
        birthday: data.birthday
    });
    if (!a) {
        logger.warn('Registration attempt failed to create account', { uid });
        throw new ServerError('Registration attempt failed');
    }
    const tokens = generateTokenPair(a.uid);
    if (!tokens) throw new InvalidOperationError(`Unable to generate token pair for account: ${a.uid}`);
    return { account: toAccountDTO(a), tokens };
}

const locateAccount = async (actor: string, identifier: string): Promise<AccountDTO> => {
    if (Regex.email.test(identifier)) {
        return await findAccountByEmail(actor, identifier);
    } else {
        let user = await findUserByUsername(actor, identifier);
        return await findAccount(actor, user.uid);
    }
}

/**
 * This method will authenticate an account using the given credentials
 * @param actor Unique id of account that initiated the operation
 * @param data AuthenticationPayload object
 * @returns AccountResponse if authentication was successful
 */
export const authenticate = async (actor: string, data: AuthenticationPayload): Promise<AuthResponse> => {
    const a = await locateAccount(actor, data.identifier);
    if (!a) throw new InvalidOperationError(`Account does not exist: ${data.identifier}`);
    const valid = await bcrypt.compare(data.password, a.password);
    if (!valid) throw new InvalidOperationError("Invalid credentials provided");
    const tokens = generateTokenPair(a.uid);
    if (!tokens) throw new InvalidOperationError(`Unable to generate token pair for account: ${a.uid}`);
    return { account: toAccountDTO(a), tokens };
}
