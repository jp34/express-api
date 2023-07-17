import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import { Account } from "../config/db";
import should from "should";
import {
    validateAccountResponse,
    validateTokenResponse,
    validateRefreshResponse
} from "../util/test";

chai.use(chaiHttp);

let account = {
    email: "test@test.com",
    password: "password",
    name: "test",
    username: "testuser",
    phone: "1234567890",
    birthday: "2000-01-01",
};

let tokens = {
    access: "",
    refresh: ""
};

describe('[sn-api] Auth Service', () => {

    after('Tear Down: Delete created account', (done) => {
        Account.deleteOne({ email: account.email }).then(() => {
            done();
        });
    });

    it('Registers a new account', (done) => {
        chai.request(server)
            .post('/api/auth/signup')
            .set('Content-Type', 'application/json')
            .send({ data: account })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body.data);
                validateAccountResponse(res.body.data.account);
                validateTokenResponse(res.body.data.tokens);
                done();
            });
    });

    it('Authorizes an account', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ data: {
                email: account.email,
                password: account.password
            }})
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body.data);
                validateTokenResponse(res.body.data.tokens);
                tokens.access = res.body.data.tokens.access;
                tokens.refresh = res.body.data.tokens.refresh;
                done();
            });
    });

    it('Handles unknown identifier', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ data: { email: "invalid@invalid.com", password: "invalid" }})
            .end((err, res) => {
                should.equal(res.status, 400);
                should.not.exist(res.body.data);
                should.exist(res.body.error);
                should.equal(res.body.error, "Account does not exist");
                done();
            });
    });

    it('Handles incorrect password', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ data: { email: account.email, password: "invalid" }})
            .end((err, res) => {
                should.equal(res.status, 400);
                should.not.exist(res.body.data);
                should.exist(res.body.error);
                should.equal(res.body.error, "Invalid credentials provided");
                done();
            });
    });

    it('Refreshes account token', (done) => {
        chai.request(server)
            .post('/api/auth/refresh')
            .set('Content-Type', 'application/json')
            .send({ data: {
                refresh: tokens.refresh
            }})
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body.data);
                validateRefreshResponse(res.body.data.tokens);
                done();
            });
    });
});
