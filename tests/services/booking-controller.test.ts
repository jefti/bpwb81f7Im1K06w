import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from 'jsonwebtoken';
import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import { createBooking, createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory";
import { Booking, Room, TicketStatus } from "@prisma/client";
import { InputBookingBody } from "@/services";


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
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', ()=>{
        it('should respond with status 404 when user doesnt have an booking yet', async () => {
            const token = await generateValidToken();

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it('should respond with status 200 and with booking data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user)
            const createdHotel = await createHotel();
            const createdRoom = await createRoomWithHotelId(createdHotel.id);
            const createdBooking = await createBooking(user.id, createdRoom.id);

            const response = await server.get('/booking').set('Authorization', `BEARER ${token}`);
            
            expect(response.status).toEqual(httpStatus.OK);

            expect(response.body).toEqual({
                id: createdBooking.id,
                Room:{
                    id: createdRoom.id,
                    name: createdRoom.name,
                    capacity: createdRoom.capacity,
                    hotelId: createdRoom.hotelId,
                    createdAt: createdRoom.createdAt.toISOString(),
                    updatedAt: createdRoom.updatedAt.toISOString()
                }
            });
        })
    });
});

describe('POST /booking', ()=>{
    it('Should respond with error 401 if no token is given', async()=>{
        const response = await server.post("/booking");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe('when token is valid', ()=>{
        it('should respond with status 400 if no body is giving', async () => {
            const token = await generateValidToken();

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });
        it('should respond with status 400 when body is invalid', async () => {
            const token = await generateValidToken();
            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

            const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(invalidBody);
            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });
        describe('When token and body are valid',()=>{
            it('Should respond with status 201 and BookingId when everything is OK',async ()=>{
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketType(false, true);
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                const createdHotel = await createHotel();
                const createdRoom:Room = await createRoomWithHotelId(createdHotel.id);
                const body:InputBookingBody = {roomId:createdRoom.id};

                const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
                expect(response.status).toEqual(httpStatus.OK);
                expect(response.body).toEqual({bookingId: expect.any(Number)});
            })
        });
    });
});

describe('PUT /booking/:bookingId', ()=>{
    it('Should respond with error 401 if no token is given', async()=>{
        const response = await server.put("/booking/1");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe('when token is valid', ()=>{
        it('should respond with status 400 if no body is giving', async () => {
            const token = await generateValidToken();

            const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });
        it('should respond with status 400 when body is invalid', async () => {
            const token = await generateValidToken();
            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

            const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(invalidBody);
            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });
        describe('When token and body are valid', ()=>{
            it('should respond with status code 400 when passed BookingId is invalid',async ()=>{
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketType(false, true);
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                const createdHotel = await createHotel();
                const createdRoom:Room = await createRoomWithHotelId(createdHotel.id);
                const body:InputBookingBody = {roomId:createdRoom.id};

                const response = await server.put('/booking/-5').set('Authorization', `Bearer ${token}`).send(body);
                expect(response.status).toEqual(httpStatus.BAD_REQUEST);
            });
            it('Should respond with status code 200 and bookingId when everything is OK',async()=>{
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketType(false, true);
                const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
                const createdHotel = await createHotel();
                const originalRoom:Room = await createRoomWithHotelId(createdHotel.id);
                const createdBooking:Booking = await createBooking(user.id, originalRoom.id);
                const newRoom:Room = await createRoomWithHotelId(createdHotel.id);
                const body:InputBookingBody = {roomId:newRoom.id};

                const response = await server.put(`/booking/${createdBooking.id}`).set('Authorization', `Bearer ${token}`).send(body);
                expect(response.status).toEqual(httpStatus.OK);
                expect(response.body).toEqual({bookingId: expect.any(Number)});
            });
        })
    })
});
