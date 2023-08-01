import bcrypt from "bcrypt";
import { InvalidOperationError } from "../../domain/error";
import { createAccount, findAccount } from "./accounts.service";
import { CreateAccountPayload } from "../../domain/dto/account.dto";
import { AuthenticationPayload, AuthResponse } from "../../domain/dto/auth";
import logger from "../../config/logger";
import { generateTokenPair } from "./token.service";

/**
 * This method will register account new account using the provided data
 * @param actor Unique id of account that initiated the operation
 * @param payload Values to create new account with
 * @returns AccountResponse if registration was successful
 */
export const register = async (actor: string, payload: CreateAccountPayload): Promise<AuthResponse> => {
    const account = await createAccount(actor, payload);
    const tokens = generateTokenPair(account.uid);
    if (!tokens) throw new InvalidOperationError(`Unable to generate token pair for account: ${account.uid}`);
    logger.info({
        operation: "register",
        actor,
        payload,
        resource: `account:${account.uid}`
    });
    return { account, tokens };
}

/**
 * This method will authenticate an account using the given credentials
 * @param actor Unique id of account that initiated the operation
 * @param payload Credentials to authenticate
 * @returns AccountResponse if authentication was successful
 */
export const authenticate = async (actor: string, payload: AuthenticationPayload): Promise<AuthResponse> => {
    const account = await findAccount(actor, { email: payload.identifier.toLowerCase() });
    if (!account) throw new InvalidOperationError(`Account does not exist: ${payload.identifier}`);
    const valid = await bcrypt.compare(payload.password, account.password);
    if (!valid) throw new InvalidOperationError("Invalid credentials provided");
    const tokens = generateTokenPair(account.uid);
    if (!tokens) throw new InvalidOperationError(`Unable to generate token pair for account: ${account.uid}`);
    logger.info({
        operation: "authenticate",
        actor,
        payload,
        resource: `account:${account.uid}`
    });
    return { account, tokens };
}
