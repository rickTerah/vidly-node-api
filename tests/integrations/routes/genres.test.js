require('express-async-errors');
const request = require('supertest');
const { Genre } = require('../../../models/genres');
const { User } = require('../../../models/users');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});
    });

    describe('GET /', () => {
        it('Should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('Should return 1 genre with the specified ID', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id); 
            expect(res.body).toHaveProperty('name', genre.name);
            expect(res.status).toBe(200);
        });
        it('Should return 404 if  genreId is invalid', async () => {
            const res = await request(server).get('/api/genres/1'); 
            expect(res.status).toBe(404);
        });
        it('Should return 404 if  genreId is valid but does not exist', async () => {
            const id = mongoose.Types.ObjectId(); //
            const res = await request(server).get('/api/genres/' + id); 
            expect(res.status).toBe(404);
        });
    });
    describe('POST /', () =>{
        it('Should return a 401 if client is not logged in', async () => {
            const res = await request(server).post('/api/genres').send({name: 'genre1'});
            expect(res.status).toBe(401);
        });
        it('Should return a 400 genre is less than 3 characters', async () => {
            const token = new User().generateAUTHToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: 'ge'});
            expect(res.status).toBe(400);
        });
        it('Should return a 400 genre is more than 20 characters', async () => {
            const token = new User().generateAUTHToken();
            const name = new Array(40).join('a');
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: name});
            expect(res.status).toBe(400);
        });
        it('Should return save the genre if it is valid', async () => {
            const token = new User().generateAUTHToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: 'genre1'});
            const genre = await Genre.find({name: 'genre1'});
            expect(genre).not.toBeNull();
        });
        it('Should return the genre if it is valid', async () => {
            const token = new User().generateAUTHToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: 'genre1'});
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
    describe('PUT /:id', () => {
        let token; 
        let newName; 
        let genre; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .put('/api/genres/' + id)
            .set('x-auth-token', token)
            .send({ name: newName });
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          genre = new Genre({ name: 'genre1' });
          await genre.save();
          
          token = new User().generateAUTHToken();     
          id = genre._id; 
          newName = 'updatedName'; 
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 400 if genre is less than 5 characters', async () => {
          newName = '1234'; 
          
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should return 400 if genre is more than 50 characters', async () => {
          newName = new Array(52).join('a');
    
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should return 404 if id is invalid', async () => {
          id = 1;
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should return 404 if genre with the given id was not found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should update the genre if input is valid', async () => {
          await exec();
    
          const updatedGenre = await Genre.findById(genre._id);
    
          expect(updatedGenre.name).toBe(newName);
        });
    
        it('should return the updated genre if it is valid', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('name', newName);
        });
    });  
    
    describe('DELETE /:id', () => {
        let token; 
        let genre; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .delete('/api/genres/' + id)
            .set('x-auth-token', token)
            .send();
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          genre = new Genre({ name: 'genre1' });
          await genre.save();
          
          id = genre._id; 
          token = new User({ isAdmin: true }).generateAUTHToken();     
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 403 if the user is not an admin', async () => {
          token = new User({ isAdmin: false }).generateAUTHToken(); 
    
          const res = await exec();
    
          expect(res.status).toBe(403);
        });
    
        it('should return 404 if id is invalid', async () => {
          id = 1; 
          
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should return 404 if no genre with the given id was found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should delete the genre if input is valid', async () => {
          await exec();
    
          const genreInDb = await Genre.findById(id);
    
          expect(genreInDb).toBeNull();
        });
    
        it('should return the removed genre', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', genre._id.toHexString());
          expect(res.body).toHaveProperty('name', genre.name);
        });
    });
});
