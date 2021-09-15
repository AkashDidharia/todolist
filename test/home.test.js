const assert = require('assert');
const expect = require('expect');
const request = require('supertest');
const app = require('../server');

const serverApp = app();

describe('Unit tesing the /register route', () => {

    it('should return ok status when triggered',async () => {
        return request(serverApp)
                .post('/register')  
                .set({
                    first_name: 'John',
                    last_name: 'Simons',
                    email: 'johnsimons@gmail.com',
                    password: 'johnsimons'
                })
                .then( (response) => {
                    console.log(response);
            assert.equal(response.status, 200);
        })
    });

    it('should return the token in string format', () => {
        let user ={
            first_name: 'John',
            last_name: 'Simons',
            email: 'johnsimons@gmail.com',
            password: 'johnsimons'
        };
        return request(serverApp).post('/register').set(user).then( (response)=>{
            expect(response.token).to.be.a('string');
        })
    })
})