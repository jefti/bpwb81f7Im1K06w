import faker from "@faker-js/faker";
import httpStatus from "http-status";
import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb } from "../helpers";


beforeAll(async () => {
    await init();
});
  
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', ()=>{
    it('Should respond with error 401 if no token is given', async()=>{
        const response = await server.get("/booking");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
})

