import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Account } from "../../config/db";
import { InvalidOperationError } from "../models/error";
import { sanitizeAccountResponse, findAccountExistsWithEmail } from "./accounts.service";
import { AccountResponse } from "../models/account";
import { RegistrationPayload, AuthenticationPayload } from "../models/auth";
import logger from "../../config/logger";
import { ServerError } from "../models/error";

export const register = async (data: RegistrationPayload): Promise<AccountResponse> => {

    // Validate user does not already exist
    const exists = await findAccountExistsWithEmail(data.email);
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

export const authenticate = async (data: AuthenticationPayload): Promise<AccountResponse> => {
    const account = await Account.findOne({ email: data.identifier });
    if (!account) throw new InvalidOperationError("Account does not exist");
    const valid = await bcrypt.compare(data.password, account.password);
    if (!valid) throw new InvalidOperationError("Invalid credentials provided");
    return sanitizeAccountResponse(account);
}
