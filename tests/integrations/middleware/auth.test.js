const request = require('supertest');
const { User } = require('../../../models/users');
const { Genre } = require('../../../models/genres');

let server;
describe('auth middleware', () => {
    beforeEach( () => {server = require('../../../index');});
    afterEach( async () => {
        server.close();
        await Genre.deleteMany();
    });

    let token;
        // define a happy path
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: 'marvel'});

        beforeEach( () => {
            token = new User().generateAUTHToken();
        });
    }
    it('Should return 401 if no token provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('Should return 400 if token is invalid', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('Should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});