import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import { Account } from "../config/db";
import should from "should";

chai.use(chaiHttp);

let account = {
    email: "test@test.com",
    password: "password",
    username: "test",
    phone: "1234567890",
    birthday: "2000-01-01",
};

let tokens = {
    access: "",
    refresh: ""
};

describe('Auth', () => {

    before('Drop existing accounts', (done) => {
        Account.deleteMany().then(() => {
            done();
        });
    })

    it('Create a new account', (done) => {

        chai.request(server)
            .post('/api/auth/signup')
            .set('Content-Type', 'application/json')
            .send({ data: account })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);

                // Validate account
                should.exist(res.body.account);
                should.exist(res.body.account.email);
                should.exist(res.body.account.password);
                should.exist(res.body.account.username);
                should.exist(res.body.account.phone);
                should.exist(res.body.account.birthday);
                should.exist(res.body.account.verified);
                should.exist(res.body.account.locked);
                should.exist(res.body.account.deactivated);
                should.exist(res.body.account.created);
                should.exist(res.body.account.modified);
                should.equal(res.body.account.email, account.email);
                should.equal(res.body.account.username, account.username);
                should.equal(res.body.account.phone, account.phone);
                should.equal(res.body.account.birthday, account.birthday);
                should.equal(typeof res.body.account.password, 'string');
                should.equal(typeof res.body.account.verified, 'boolean');
                should.equal(typeof res.body.account.locked, 'boolean');
                should.equal(typeof res.body.account.deactivated, 'boolean');
                should.equal(typeof res.body.account.created, 'string');
                should.equal(typeof res.body.account.modified, 'string');
                
                // Validate tokens
                should.exist(res.body.tokens);
                should.exist(res.body.tokens.access);
                should.exist(res.body.tokens.refresh);
                should.equal(typeof res.body.tokens.access, 'string');
                should.equal(typeof res.body.tokens.refresh, 'string');

                done();
            });
    });

    it('Log in with new account', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ data: {
                identifier: account.email,
                password: account.password
            }})
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);

                // Validate tokens
                should.exist(res.body.tokens);
                should.exist(res.body.tokens.access);
                should.exist(res.body.tokens.refresh);
                should.equal(typeof res.body.tokens.access, 'string');
                should.equal(typeof res.body.tokens.refresh, 'string');

                tokens.access = res.body.tokens.access;
                tokens.refresh = res.body.tokens.refresh;

                done();
            });
    });

    it('Refresh account tokens', (done) => {
        chai.request(server)
            .post('/api/auth/refresh')
            .set('Content-Type', 'application/json')
            .send({ data: tokens.refresh })
            .end((err, res) => {
                

                done();
            });
    });
});