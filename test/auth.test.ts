import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/server";
import should from "should";
import { validateAuthResponse, validateTokenResponse, validateUserResponse } from "./util/validate";

chai.use(chaiHttp);

let account = {
    uid: "",
    email: "test@test.com",
    password: "password",
    name: "test",
    phone: "1234567890",
    birthday: "2000-01-01",
};

let user = {
    username: "testuser",
    interests: ["dining", "food_truck", "restaurant"],
};

let tokens = {
    access: "",
    refresh: ""
};

describe('[sn-api] Auth', () => {

    after('Tear Down: Delete test account', (done) => {
        chai.request(server)
            .delete(`/api/accounts/${account.uid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.equal(res.body.data.deleted, true);
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
                validateAuthResponse(res.body.data);
                account.uid = res.body.data.account.uid;
                tokens.access = res.body.data.tokens.access;
                tokens.refresh = res.body.data.tokens.refresh;
                done();
            });
    });

    it ('Registers a new user', (done) => {
        chai.request(server)
            .post(`/api/users/${account.uid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .send({ data: user })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body.data);
                validateUserResponse(res.body.data);
                done();
            });
    });

    it('Authenticates new account by username', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ data: {
                identifier: user.username,
                password: account.password
            }})
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body.data);
                validateAuthResponse(res.body.data);
                done();
            });
    });

    it('Authenticates new account', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ data: {
                identifier: account.email,
                password: account.password
            }})
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body.data);
                validateAuthResponse(res.body.data);
                done();
            });
    });

    it('Handles unknown identifier', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ data: { identifier: "invalid@invalid.com", password: "invalid" }})
            .end((err, res) => {
                should.equal(res.status, 400);
                should.not.exist(res.body.data);
                should.exist(res.body.error);
                should.equal(res.body.error, "Account does not exist: invalid@invalid.com");
                done();
            });
    });

    it('Handles incorrect password', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ data: { identifier: account.email, password: "invalid" }})
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
                validateTokenResponse(res.body.data.tokens);
                done();
            });
    });
});