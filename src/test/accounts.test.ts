import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import should from "should";

chai.use(chaiHttp);

let account = {
    _id: "",
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

                // Validate account response
                should.exist(res.body.data);
                res.body.data.should.be.Array();
                res.body.data.should.not.have.length(0);

                res.body.data[0].email.should.be.String();
                res.body.data[0].password.should.be.String();
                res.body.data[0].name.should.be.String();
                res.body.data[0].username.should.be.String();
                res.body.data[0].phone.should.be.String();
                res.body.data[0].birthday.should.be.String();
                res.body.data[0].verified.should.be.Boolean();
                res.body.data[0].locked.should.be.Boolean();
                res.body.data[0].deactivated.should.be.Boolean();
                res.body.data[0].created.should.be.String();
                res.body.data[0].modified.should.be.String();
                res.body.data[0]._id.should.be.String();

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

                // Validate account response
                should.exist(res.body.data);
                should.exist(res.body.data.email);
                should.exist(res.body.data.password);
                should.exist(res.body.data.name);
                should.exist(res.body.data.username);
                should.exist(res.body.data.phone);
                should.exist(res.body.data.birthday);
                should.exist(res.body.data.verified);
                should.exist(res.body.data.locked);
                should.exist(res.body.data.deactivated);
                should.exist(res.body.data.created);
                should.exist(res.body.data.modified);
                should.equal(res.body.data.email, account.email);
                should.equal(res.body.data.name, account.name);
                should.equal(res.body.data.username, account.username);
                should.equal(res.body.data.phone, account.phone);
                should.equal(res.body.data.birthday, account.birthday);
                res.body.data.password.should.be.String();
                res.body.data.created.should.be.String();
                res.body.data.modified.should.be.String();
                res.body.data.verified.should.be.Boolean();
                res.body.data.locked.should.be.Boolean();
                res.body.data.deactivated.should.be.Boolean();

                done();
            })
    });

    it('Updates an account', (done) => {
        account.email = 'newEmail@test.com';
        account.password = 'newPassword';
        account.username = 'newUsername';
        account.phone = '1112223333';
        account.birthday = '2000-12-01';

        chai.request(server)
            .put(`/api/accounts/${account._id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .send({ data: account })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);

                // Validate account response
                should.exist(res.body.data);
                should.exist(res.body.data.email);
                should.exist(res.body.data.password);
                should.exist(res.body.data.name);
                should.exist(res.body.data.username);
                should.exist(res.body.data.phone);
                should.exist(res.body.data.birthday);
                should.exist(res.body.data.verified);
                should.exist(res.body.data.locked);
                should.exist(res.body.data.deactivated);
                should.exist(res.body.data.created);
                should.exist(res.body.data.modified);
                should.equal(res.body.data.email, account.email);
                should.equal(res.body.data.name, account.name);
                should.equal(res.body.data.username, account.username);
                should.equal(res.body.data.phone, account.phone);
                should.equal(res.body.data.birthday, account.birthday);
                res.body.data.password.should.be.String();
                res.body.data.created.should.be.String();
                res.body.data.modified.should.be.String();
                res.body.data.verified.should.be.Boolean();
                res.body.data.locked.should.be.Boolean();
                res.body.data.deactivated.should.be.Boolean();

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
                should.exist(res.body);

                should.equal(res.body.deleted, true);

                done();
            });
    });
});
