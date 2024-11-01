import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/server";
import should from "should";
import { validateAccountResponse } from "./util/validate";

chai.use(chaiHttp);

let account = {
    _id: "",
    email: "test@test.com",
    password: "password",
    name: "test",
    phone: "1234567890",
    birthday: "2000-01-01",
};

let tokens = {
    access: "",
    refresh: ""
};

describe('[sn-api] Accounts Service', () => {

    before('Set Up: Create test account', (done) => {
        chai.request(server)
            .post('/api/auth/signup')
            .set('Content-Type', 'application/json')
            .send({ data: account })
            .end((err, res) => {
                account._id = res.body.data.account._id;
                tokens.access = res.body.data.tokens.access;
                tokens.refresh = res.body.data.tokens.refresh;
                done();
            });
    });

    it('Retrieves many accounts', (done) => {
        chai.request(server)
            .get('/api/accounts')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.exist(res.body.data);
                res.body.data.should.be.Array();
                res.body.data.should.not.have.length(0);
                validateAccountResponse(res.body.data[0]);
                done();
            });
    });

    it('Retrieves an account', (done) => {
        chai.request(server)
            .get(`/api/accounts/${account._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.exist(res.body.data);
                validateAccountResponse(res.body.data);
                done();
            });
    });

    it('Updates account email', (done) => {
        account.email = 'newEmail@test.com';
        chai.request(server)
            .put(`/api/accounts/${account._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .query({
                email: account.email
            })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.equal(res.body.data, true);
                done();
            });
    });

    it('Updates account password', (done) => {
        account.password = 'NewPassword123!?';
        chai.request(server)
            .put(`/api/accounts/${account._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .query({
                password: account.password
            })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.equal(res.body.data, true);
                done();
            });
    });

    it('Updates account name', (done) => {
        account.name = 'newname';
        chai.request(server)
            .put(`/api/accounts/${account._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .query({
                name: account.name
            })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.equal(res.body.data, true);
                done();
            });
    });

    it('Updates account phone', (done) => {
        account.phone = '111-222-3333';
        chai.request(server)
            .put(`/api/accounts/${account._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .query({
                phone: account.phone
            })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.equal(res.body.data, true);
                done();
            });
    });

    it('Updates account birthday', (done) => {
        account.birthday = '2000-12-31';
        chai.request(server)
            .put(`/api/accounts/${account._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .query({
                birthday: account.birthday
            })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.equal(res.body.data, true);
                done();
            });
    });

    it('Verifies updated data', (done) => {
        chai.request(server)
            .get(`/api/accounts/${account._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.exist(res.body.data);
                validateAccountResponse(res.body.data);
                should.equal(res.body.data.email, account.email.toLowerCase());
                should.equal(res.body.data.name, account.name);
                should.equal(res.body.data.phone, account.phone);
                should.equal(res.body.data.birthday, account.birthday);
                done();
            });
    });

    it('Deletes an account', (done) => {
        chai.request(server)
            .delete(`/api/accounts/${account._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.equal(res.body.data.deleted, true);
                done();
            });
    });
});
