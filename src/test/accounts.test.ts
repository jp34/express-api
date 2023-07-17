import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import should from "should";
import { validateAccountResponse } from "../util/test";

chai.use(chaiHttp);

let account = {
    uid: "",
    email: "test@test.com",
    password: "password",
    name: "test",
    phone: "1234567890",
    birthday: "2000-01-01",
    username: "testuser",
    interests: ["dining", "food_truck", "restaurant"],
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
                account.uid = res.body.data.account.uid;
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
            .get(`/api/accounts/${account.uid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.exist(res.body.data);
                validateAccountResponse(res.body.data);
                done();
            })
    });

    it('Updates an account', (done) => {
        account.email = 'newEmail@test.com';
        account.password = 'newPassword';
        account.phone = '1112223333';
        account.birthday = '2000-12-01';

        chai.request(server)
            .put(`/api/accounts/${account.uid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .send({ data: account })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                validateAccountResponse(res.body.data);
                done();
            });
    });

    it('Deletes an account', (done) => {
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
});
