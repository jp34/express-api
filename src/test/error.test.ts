import { describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server";
import should from "should";

chai.use(chaiHttp);

describe('[sn-api] Error Handling', () => {

    it('Handles missing token', (done) => {
        chai.request(server)
            .get('/api/accounts')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                should.equal(res.statusCode, 406);
                should.equal(res.body.error, "Missing authorization token");
                should.not.exist(res.body.data);

                done();
            });
    });

    it('Handles malformed token', (done) => {
        chai.request(server)
            .get('/api/accounts')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer adiawjodjawodj')
            .end((err, res) => {
                should.equal(res.statusCode, 406);
                should.equal(res.body.error, "Invalid or malformed token provided");
                should.not.exist(res.body.data);

                done();
            });
    });
});
