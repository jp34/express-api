import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/server";
import should from "should";
import { validateTagResponse } from "./util/validate";

chai.use(chaiHttp);

let account = {
    uid: "",
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

let user = {
    username: "testuser",
    interests: ["dining", "food_truck", "restaurant"],
};

let tag = {
    name: "new_tag",
    label: "New Tag",
    parent: "venue",
    ref: "123123",
};

describe('[sn-api] Tags Service', () => {

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

    it('Creates a new tag', (done) => {
        chai.request(server)
            .post('/api/tags')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .send({ data: tag })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                validateTagResponse(res.body.data);
                done();
            });
    });

    it ('Retrieves many tags', (done) => {
        chai.request(server)
            .get('/api/tags')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.exist(res.body.data);
                res.body.data.should.be.Array();
                res.body.data.should.not.have.length(0);
                validateTagResponse(res.body.data[0]);
                done();
            });
    });

    it('Retrieves one tag', (done) => {
        chai.request(server)
            .get(`/api/tags/${tag.name}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                validateTagResponse(res.body.data);
                done();
            });
    });

    it('Updates a tag', (done) => {
        tag.label = "New tag label";
        tag.parent = "social";
        tag.ref = "333333";

        chai.request(server)
            .put(`/api/tags/${tag.name}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .send({ data: {
                label: tag.label,
                parent: tag.parent,
                ref: tag.ref,
            }})
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                validateTagResponse(res.body.data);
                done();
            });
    });

    it ('Deletes a tag', (done) => {
        chai.request(server)
            .delete(`/api/tags/${tag.name}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.equal(res.body.data.deleted, true);
                done();
            });
    });
});
