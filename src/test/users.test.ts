import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import should from "should";
import { validateUserResponse } from "../util/test";
import { Account, User } from "../config/db";

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

const isSameArray = (a: string[], b: string[]) => {
    let same = true;
    a.forEach((i) => { same = b.includes(i); });
    return same;
}

describe('[sn-api] Users Service', () => {
    
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

    after('Tear Down: Delete created account', async () => {
        await User.deleteOne({ username: account.username });
        await Account.deleteOne({ email: account.email });
    });

    // Read

    it('Retrieves many users', (done) => {
        chai.request(server)
            .get('/api/users')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.exist(res.body.data);
                res.body.data.should.be.Array();
                res.body.data.should.not.have.length(0);
                validateUserResponse(res.body.data[0]);
                done();
            });
    });

    it('Retrieves a user', (done) => {
        chai.request(server)
            .get(`/api/users/${account.uid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                validateUserResponse(res.body.data);
                done();
            })
    });

    // Update

    it('Updates a user', (done) => {
        chai.request(server)
            .get(`/api/users/${account.uid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                validateUserResponse(res.body.data);
                done();
            })
    });

    it('Adds interests to a user', (done) => {
        chai.request(server)
            .put(`/api/users/${account.uid}/interests`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .send({ data: account.interests })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body.data);
                res.body.data.should.be.Array();
                const same = isSameArray(res.body.data, account.interests);
                should.equal(true, same);
                done();
            });
    });

    it('Retrieves user interests', (done) => {
        chai.request(server)
            .get(`/api/users/${account.uid}/interests`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body.data);
                res.body.data.should.be.Array();
                const same = isSameArray(res.body.data, account.interests);
                should.equal(true, same);
                done();
            });
    });

    it('Removes an interest from a user', (done) => {
        account.interests = ["dining", "food_truck"];
        chai.request(server)
            .delete(`/api/users/${account.uid}/interests`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .send({ data: ["restaurant"] })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body.data);
                res.body.data.should.be.Array();
                const same = isSameArray(res.body.data, account.interests);
                should.equal(true, same);
                done();
            });
    });

    // Delete

    it('Deletes a user', (done) => {
        chai.request(server)
            .delete(`/api/users/${account.uid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.equal(res.body.data.deleted, true);
                done();
            });
    });
});
