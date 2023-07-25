import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/server";
import should from "should";

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
    interests: ["japanese", "mexican", "greek"],
};

let geo = {
    latitude: 41.4810112,
    longitude: -81.5464448
};

describe('[sn-api] Places Service', () => {

    before('Set Up: Create test account & user', (done) => {

        chai.request(server)
            .post('/api/auth/signup')
            .set('Content-Type', 'application/json')
            .send({ data: account })
            .end((err, res) => {
                should.equal(res.status, 200);
                account.uid = res.body.data.account.uid;
                tokens.access = res.body.data.tokens.access;
                tokens.refresh = res.body.data.tokens.refresh;

                chai.request(server)
                    .post(`/api/users/${account.uid}`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', `Bearer ${tokens.access}`)
                    .send({ data: { username: user.username, interests: user.interests }})
                    .end((err, res) => {
                        should.equal(res.status, 200);
                        done();
                    });
            });
    });

    after('Tear Down: Delete test account & user', (done) => {
        chai.request(server)
            .delete(`/api/users/${account.uid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .end((err, res) => {
                should.equal(res.status, 200);
                should.equal(res.body.data.deleted, true);

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

    it('Retrieves nearby places', (done) => {
        chai.request(server)
            .get('/api/places/nearby')
            .set('Authorization', `Bearer ${tokens.access}`)
            .query({
                latitude: geo.latitude,
                longitude: geo.longitude
            })
            .end((err, res) => {
                should.equal(res.status, 200);
                res.body.data.should.be.Array();
                should.equal(res.body.data.length, 15);
                done();
            });
    }).timeout(4000);
});
