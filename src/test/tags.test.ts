import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import { Account } from "../config/db";
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
            tokens.access = res.body.tokens.access;
            tokens.refresh = res.body.tokens.refresh;
            done();
        });
    });

    after('Tear Down: Delete created account', (done) => {
        Account.deleteOne({ email: account.email }).then(() => {
            done();
        });
    });

    it('Create a new tag', (done) => {
        chai.request(server)
            .post('/api/tags')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .send({ data: tag })
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);

                should.exist(res.body.data);
                should.exist(res.body.data._id);
                should.exist(res.body.data.name);
                should.exist(res.body.data.label);
                should.exist(res.body.data.parent);
                should.exist(res.body.data.ref);
                
                done();
            });
    });

    it ('Retrieve many tags', (done) => {
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
                res.body.data[0]._id.should.be.String();
                res.body.data[0].name.should.be.String();
                res.body.data[0].label.should.be.String();
                res.body.data[0].parent.should.be.String();
                res.body.data[0].ref.should.be.String();

                done();
            });
    });

    it('Retrieve one tag', (done) => {
        chai.request(server)
            .get(`/api/tags/${tag.name}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.exist(res.body);

                should.exist(res.body.data);
                should.exist(res.body.data._id);
                should.exist(res.body.data.name);
                should.exist(res.body.data.label);
                should.exist(res.body.data.parent);
                should.exist(res.body.data.ref);
                res.body.data._id.should.be.String();
                res.body.data.name.should.be.String();
                res.body.data.label.should.be.String();
                res.body.data.parent.should.be.String();
                res.body.data.ref.should.be.String();

                done();
            });
    });

    it('Update a tag', (done) => {
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

                should.exist(res.body.data);
                should.exist(res.body.data._id);
                should.exist(res.body.data.name);
                should.exist(res.body.data.label);
                should.exist(res.body.data.parent);
                should.exist(res.body.data.ref);
                res.body.data._id.should.be.String();
                res.body.data.name.should.be.String();
                res.body.data.label.should.be.String();
                res.body.data.parent.should.be.String();
                res.body.data.ref.should.be.String();

                done();
            });
    });

    it ('Delete a tag', (done) => {
        chai.request(server)
            .delete(`/api/tags/${tag.name}`)
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