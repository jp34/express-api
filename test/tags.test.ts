import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/server";
import should from "should";
import { validateTagResponse } from "./util/validate";

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
            account._id = res.body.data.account._id;
            tokens.access = res.body.data.tokens.access;
            tokens.refresh = res.body.data.tokens.refresh;
            done();
        });
    });

    after('Tear Down: Delete test account', (done) => {
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

    it('Updates a tag label', (done) => {
        tag.label = "New Label";
        chai.request(server)
            .put(`/api/tags/${tag.name}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .query({ label: tag.label })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.equal(res.body.data, true);
                done();
            });
    });

    it('Updates a tag parent', (done) => {
        tag.parent = "dining";
        chai.request(server)
            .put(`/api/tags/${tag.name}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .query({ parent: tag.parent })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.equal(res.body.data, true);
                done();
            });
    });

    it('Updates a tag ref', (done) => {
        tag.ref = "111111";
        chai.request(server)
            .put(`/api/tags/${tag.name}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .query({
                ref: "111111"
            })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                should.equal(res.body.data, true);
                done();
            });
    });

    it('Verifies updated tag data', (done) => {
        chai.request(server)
            .get(`/api/tags/${tag.name}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);
                validateTagResponse(res.body.data);
                should.equal(res.body.data.name, tag.name);
                should.equal(res.body.data.label, tag.label);
                should.equal(res.body.data.parent, tag.parent);
                should.equal(res.body.data.ref, tag.ref);
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
