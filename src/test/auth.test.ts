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

                // Validate account
                should.exist(res.body.data.account);
                should.exist(res.body.data.account.email);
                should.exist(res.body.data.account.password);
                should.exist(res.body.data.account.name);
                should.exist(res.body.data.account.username);
                should.exist(res.body.data.account.phone);
                should.exist(res.body.data.account.birthday);
                should.exist(res.body.data.account.verified);
                should.exist(res.body.data.account.locked);
                should.exist(res.body.data.account.deactivated);
                should.exist(res.body.data.account.created);
                should.exist(res.body.data.account.modified);
                should.equal(res.body.data.account.email, account.email);
                should.equal(res.body.data.account.name, account.name);
                should.equal(res.body.data.account.username, account.username);
                should.equal(res.body.data.account.phone, account.phone);
                should.equal(res.body.data.account.birthday, account.birthday);
                res.body.data.account.password.should.be.String();
                res.body.data.account.created.should.be.String();
                res.body.data.account.modified.should.be.String();
                res.body.data.account.verified.should.be.Boolean();
                res.body.data.account.locked.should.be.Boolean();
                res.body.data.account.deactivated.should.be.Boolean();
                
                // Validate tokens
                should.exist(res.body.data.tokens);
                should.exist(res.body.data.tokens.access);
                should.exist(res.body.data.tokens.refresh);
                res.body.data.tokens.access.should.be.String();
                res.body.data.tokens.refresh.should.be.String();

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

                // Validate tokens
                should.exist(res.body.data.tokens);
                should.exist(res.body.data.tokens.access);
                should.exist(res.body.data.tokens.refresh);
                res.body.data.tokens.access.should.be.String();
                res.body.data.tokens.refresh.should.be.String();

                tokens.access = res.body.data.tokens.access;
                tokens.refresh = res.body.data.tokens.refresh;

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

                // Validate access token
                should.exist(res.body.data.tokens);
                should.exist(res.body.data.tokens.access);
                res.body.data.tokens.access.should.be.String();

                done();
            });
    });
});
