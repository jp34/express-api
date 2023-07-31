import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { InvalidOperationError } from "../../domain/error";
import { accountExistsWithEmail, findAccountByEmail } from "./accounts.service";
import { AccountModel } from "../../domain/entity/account";
import { RegistrationPayload, AuthenticationPayload, AuthResponse } from "../../domain/dto/auth";
import logger from "../../config/logger";
import { ServerError } from "../../domain/error";
import { generateTokenPair } from "./token.service";

/**
 * This method will register account new account using the provided data
 * @param actor Unique id of account that initiated the operation
 * @param dataccount RegistrationPayload object
 * @returns AccountResponse if registration was successful
 */
export const register = async (actor: string, data: RegistrationPayload): Promise<AuthResponse> => {
    // Validate user does not already exist
    const exists = await accountExistsWithEmail(actor, data.email);
    if (exists) throw new InvalidOperationError(`Account already exists with email(${data.email})`);

    // Create new account
    const uid = v4();
    const encrypted = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
    const account = await AccountModel.create({
        uid: uid,
        email: data.email.toUpperCase(),
        password: encrypted,
        name: data.name,
        phone: data.phone,
        birthday: data.birthday
    });
    if (!account) {
        logger.warn('Registration attempt failed to create account', { uid });
        throw new ServerError('Registration attempt failed');
    }
    const tokens = generateTokenPair(account.uid);
    if (!tokens) throw new InvalidOperationError(`Unable to generate token pair for account: ${account.uid}`);
    return { account, tokens };
}

/**
 * This method will authenticate an account using the given credentials
 * @param actor Unique id of account that initiated the operation
 * @param dataccount AuthenticationPayload object
 * @returns AccountResponse if authentication was successful
 */
export const authenticate = async (actor: string, data: AuthenticationPayload): Promise<AuthResponse> => {
    const account = await findAccountByEmail(actor, data.identifier);
    if (!account) throw new InvalidOperationError(`Account does not exist: ${data.identifier}`);
    const valid = await bcrypt.compare(data.password, account.password);
    if (!valid) throw new InvalidOperationError("Invalid credentials provided");
    const tokens = generateTokenPair(account.uid);
    if (!tokens) throw new InvalidOperationError(`Unable to generate token pair for account: ${account.uid}`);
    return { account, tokens };
}
