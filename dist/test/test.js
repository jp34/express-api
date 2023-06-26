"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const server_1 = __importDefault(require("../server"));
const db_1 = require("../config/db");
const should_1 = __importDefault(require("should"));
chai_1.default.use(chai_http_1.default);
(0, mocha_1.describe)('Auth', () => {
    before('Drop existing accounts', (done) => {
        db_1.Account.deleteMany().then(() => {
            done();
        });
    });
    (0, mocha_1.it)('Create a new account', (done) => {
        let data = {
            email: "test@test.com",
            password: "password",
            username: "test",
            phone: "1234567890",
            birthday: "2000-01-01",
        };
        chai_1.default.request(server_1.default)
            .post("/api/auth/signup")
            .set('Content-Type', 'application/json')
            .send({ data })
            .end((err, res) => {
            should_1.default.equal(res.status, 200);
            should_1.default.exist(res.body);
            // Validate response schema
            should_1.default.exist(res.body.account);
            should_1.default.exist(res.body.account.email);
            should_1.default.exist(res.body.account.password);
            should_1.default.exist(res.body.account.username);
            should_1.default.exist(res.body.account.phone);
            should_1.default.exist(res.body.account.birthday);
            should_1.default.exist(res.body.account.verified);
            should_1.default.exist(res.body.account.locked);
            should_1.default.exist(res.body.account.deactivated);
            should_1.default.exist(res.body.account.created);
            should_1.default.exist(res.body.account.modified);
            should_1.default.exist(res.body.tokens);
            should_1.default.exist(res.body.tokens.access);
            should_1.default.exist(res.body.tokens.refresh);
            // Validate response type
            should_1.default.equal(res.body.account.email, "test@test.com");
            should_1.default.equal(typeof res.body.account.password, "string");
            should_1.default.equal(res.body.account.username, "test");
            should_1.default.equal(res.body.account.phone, "1234567890");
            should_1.default.equal(res.body.account.birthday, '2000-01-01');
            should_1.default.equal(typeof res.body.account.verified, 'boolean');
            should_1.default.equal(typeof res.body.account.locked, 'boolean');
            should_1.default.equal(typeof res.body.account.deactivated, 'boolean');
            should_1.default.equal(typeof res.body.account.created, 'string');
            should_1.default.equal(typeof res.body.account.modified, 'string');
            should_1.default.equal(typeof res.body.tokens.access, 'string');
            should_1.default.equal(typeof res.body.tokens.refresh, 'string');
            done();
        });
    });
});
