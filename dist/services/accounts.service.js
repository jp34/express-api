"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.updateAccount = exports.findAccountExistsWithEmail = exports.findAccountExistsWithId = exports.findAccountByEmail = exports.findAccountById = exports.findAccounts = exports.createAccount = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../config/db");
const error_1 = require("../models/error");
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
const createAccount = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const encrypted = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync());
    return yield db_1.Account.create({
        email: email,
        password: encrypted
    });
});
exports.createAccount = createAccount;
// -- READ
/**
 * This method returns an array of accounts
 * @returns An array of accounts
 */
const findAccounts = (offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (offset && limit)
        return yield db_1.Account.find().skip(offset).limit(limit);
    else if (offset && !limit)
        return yield db_1.Account.find().skip(offset);
    else if (!offset && limit)
        return yield db_1.Account.find().limit(limit);
    else
        return yield db_1.Account.find();
});
exports.findAccounts = findAccounts;
/**
 * This method returns a single account by its ID
 * @param id ID of requested account
 * @returns Account with matching ID
 */
const findAccountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.Account.findById(id);
});
exports.findAccountById = findAccountById;
/**
 * This method returns a single account by its email
 * @param email Email of requested account
 * @returns Account with matching email
 */
const findAccountByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.Account.findOne({ email: email });
});
exports.findAccountByEmail = findAccountByEmail;
/**
 * This method determines if an account exists with the given id
 * @param id ID to check
 * @returns True if an account exists with id, otherwise false
 */
const findAccountExistsWithId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.Account.exists({ _id: id });
});
exports.findAccountExistsWithId = findAccountExistsWithId;
/**
 * This method determines if an account exists with the given email
 * @param email Email to check
 * @returns True if an account exists with email, otherwise false
 */
const findAccountExistsWithEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.Account.exists({ email: email });
});
exports.findAccountExistsWithEmail = findAccountExistsWithEmail;
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
const updateAccount = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield db_1.Account.findById(id);
    if (account == undefined)
        throw new error_1.NonExistentResourceError("Account", id);
    if (payload.email)
        account.email = payload.email;
    if (payload.password) {
        const encrypted = bcrypt_1.default.hashSync(payload.password, bcrypt_1.default.genSaltSync());
        account.password = encrypted;
    }
    if (payload.name)
        account.name = payload.name;
    if (payload.phone)
        account.phone = payload.phone;
    if (payload.birthday)
        account.birthday = payload.birthday;
    return yield account.save();
});
exports.updateAccount = updateAccount;
// -- DELETE
/**
 * This method deletes a single account
 * @param id ID of account to delete
 * @returns The deleted account
 */
const deleteAccount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.Account.deleteOne({ _id: id });
});
exports.deleteAccount = deleteAccount;
