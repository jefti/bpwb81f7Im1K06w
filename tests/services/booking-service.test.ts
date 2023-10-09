
import { bookingsRepository } from "@/repositories/bookings-repository";
import { bookingsService } from "@/services/booking-service";
import { createBookingObject, createFakeBooking, createFakeEnrollment, createFakeRoom, createFakeTicket, fakeBookingObject } from "../factories";
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { TicketStatus } from "@prisma/client";
beforeEach(() => {
    jest.clearAllMocks();
});


describe('Get booking by user Id',()=>{
    
    it('throws error with status code 404 when findBooking returns a empty object', async ()=>{
        jest.spyOn(bookingsRepository,"findBookingByUserId").mockImplementationOnce(():any =>{
            return null;        
        });

        const booking = bookingsService.getBookingByUserId(1);
        
        expect(booking).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });

    it('It returns the correct object by the values received from the repository', async ()=>{
        const bookingId = 1;
        
        const object:fakeBookingObject = createBookingObject(bookingId);
        jest.spyOn(bookingsRepository,"findBookingByUserId")
            .mockImplementationOnce(():any =>{
                return object;        
            });

        const booking = await bookingsService.getBookingByUserId(1);
        
        expect(booking).toEqual({
            id: bookingId,
            Room:{
                id: object.Room.id,
                name: object.Room.name,
                capacity: object.Room.capacity,
                hotelId: object.Room.hotelId,
                createdAt: object.Room.createdAt,
                updatedAt: object.Room.updatedAt,  
            }
        })
    });

})

describe('Create booking',()=>{
    it(`should throw error status code 404 when user don't have enrollment`,()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return null;        
        });
        const userId:number = 1;
        const roomId:number = 1;
        const promise = bookingsService.createBooking(userId, roomId);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });
    it(`should throw error status code 404 when user don't have a ticket`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return null;        
        });
        const promise = bookingsService.createBooking(userId, roomId);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });
    it(`should throw error status code 403 when user's ticket isn't paid`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.RESERVED, false, true);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        const promise = bookingsService.createBooking(userId, roomId);
        expect(promise).rejects.toEqual({
            name: 'UnauthorizedReservationError',
            message: `User's ticket needs be paid to continue`,
        });
    });
    it(`should throw error status code 403 when user's ticket is remote`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, true, true);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        const promise = bookingsService.createBooking(userId, roomId);
        expect(promise).rejects.toEqual({
            name: 'UnauthorizedReservationError',
            message: `User's ticket won't be remote to continue`,
        });
    });
    it(`should throw error status code 403 when user's ticket not includes hotel`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, false);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        const promise = bookingsService.createBooking(userId, roomId);
        expect(promise).rejects.toEqual({
            name: 'UnauthorizedReservationError',
            message:`User's ticket needs to includes hotel to continue`,
        });
    });
    it(`should throw error status code 404 when Room doesn't exist`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, true);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        jest.spyOn(bookingsRepository,"findRoomById").mockImplementationOnce(():any =>{
            return null;
        });
        const promise = bookingsService.createBooking(userId, roomId);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    })
    it(`should throw error status code 403 when Room with no vacancy`, ()=>{
        const userId:number = 1;
        const roomId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, true);
        const fakeRoom = createFakeRoom(roomId,2,1,2);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        jest.spyOn(bookingsRepository,"findRoomById").mockImplementationOnce(():any =>{
            return fakeRoom;
        });
        const promise = bookingsService.createBooking(userId, roomId);
        expect(promise).rejects.toEqual({
            name: 'NoVacancyError',
            message: 'Room with no vacancies',
        });
    });
    it(`should response expected object when everything is ok`, async ()=>{
        const userId:number = 1;
        const roomId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, true);
        const fakeRoom = createFakeRoom(roomId,2,1,0);
        const fakeBooking = createFakeBooking(userId, roomId);

        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        jest.spyOn(bookingsRepository,"findRoomById").mockImplementationOnce(():any =>{
            return fakeRoom;
        });
        jest.spyOn(bookingsRepository,"createBooking").mockImplementationOnce(():any =>{
            return fakeBooking;
        });

        const response = await bookingsService.createBooking(userId, roomId);
        expect(response).toEqual({bookingId: fakeBooking.id});
    })
})

describe('Update Booking',()=>{
    it(`should throw error status code 404 when user don't have enrollment`,()=>{
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return null;        
        });
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });
    it(`should throw error status code 404 when user don't have a ticket`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;

        const fakeEnrollment = createFakeEnrollment(userId);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return null;        
        });
        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });
    it(`should throw error status code 403 when user's ticket isn't paid`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.RESERVED, false, true);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'UnauthorizedReservationError',
            message: `User's ticket needs be paid to continue`,
        });
    });
    it(`should throw error status code 403 when user's ticket is remote`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, true, true);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'UnauthorizedReservationError',
            message: `User's ticket won't be remote to continue`,
        });
    });
    it(`should throw error status code 403 when user's ticket not includes hotel`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, false);
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'UnauthorizedReservationError',
            message:`User's ticket needs to includes hotel to continue`,
        });
    });
    it(`should throw error status code 403 when user doesn't have a previous reservation`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, true);
        
        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        jest.spyOn(bookingsRepository, "findBookingById").mockImplementationOnce(():any=>{
            return null;
        });
        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'UnauthorizedReservationError',
            message: 'User doesnt have a previous reservation to update.',
        });
    });
    it(`should throw error status code 401 when bookingId isn't for the user`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, true);
        const fakePastBooking = createFakeBooking(userId+1, roomId);

        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        jest.spyOn(bookingsRepository, "findBookingById").mockImplementationOnce(():any=>{
            return fakePastBooking;
        });

        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'UnauthorizedError',
            message: 'You must be signed in to continue',
        });
    });
    it(`should throw error status code 409 when user previous booking is in the room`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, true);
        const fakePastBooking = createFakeBooking(userId, roomId);

        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        jest.spyOn(bookingsRepository, "findBookingById").mockImplementationOnce(():any=>{
            return fakePastBooking;
        });

        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'ConflictError',
            message: "The provided room is already registered in your name.",
        });
    });
    it(`should throw error status code 404 doesn't exist a room by id`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, true);
        const fakePastBooking = createFakeBooking(userId, roomId+1);

        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        jest.spyOn(bookingsRepository, "findBookingById").mockImplementationOnce(():any=>{
            return fakePastBooking;
        });
        jest.spyOn(bookingsRepository, "findRoomById").mockImplementationOnce(():any=>{
            return null;
        });
        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });
    it(`should throw error status code 403 when Room with no vacancy`,()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, true);
        const fakePastBooking = createFakeBooking(userId, roomId+1);
        const fakeRoom = createFakeRoom(roomId,2,1,2);

        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        jest.spyOn(bookingsRepository, "findBookingById").mockImplementationOnce(():any=>{
            return fakePastBooking;
        });
        jest.spyOn(bookingsRepository, "findRoomById").mockImplementationOnce(():any=>{
            return fakeRoom;
        });
        const promise = bookingsService.updateBooking(userId, roomId, bookingId);
        expect(promise).rejects.toEqual({
            name: 'NoVacancyError',
            message: 'Room with no vacancies',
        });
    });
    it(`should response expected object when everything is ok`,async ()=>{
        const userId:number = 1;
        const roomId:number = 1;
        const bookingId:number = 1;
        
        const fakeEnrollment = createFakeEnrollment(userId);
        const fakeTicket = createFakeTicket(fakeEnrollment.id, TicketStatus.PAID, false, true);
        const fakePastBooking = createFakeBooking(userId, roomId+1);
        const fakeRoom = createFakeRoom(roomId,2,1,0);
        const fakeNewBooking = createFakeBooking(userId, roomId);

        jest.spyOn(enrollmentRepository,"findWithAddressByUserId").mockImplementationOnce(():any =>{
            return fakeEnrollment;        
        });
        jest.spyOn(ticketsRepository,"findTicketByEnrollmentId").mockImplementationOnce(():any =>{
            return fakeTicket;        
        });
        jest.spyOn(bookingsRepository, "findBookingById").mockImplementationOnce(():any=>{
            return fakePastBooking;
        });
        jest.spyOn(bookingsRepository, "findRoomById").mockImplementationOnce(():any=>{
            return fakeRoom;
        });
        jest.spyOn(bookingsRepository,"updateBooking").mockImplementationOnce(():any =>{
            return fakeNewBooking;
        });

        const response = await bookingsService.updateBooking(userId, roomId, bookingId);
        expect(response).toEqual({bookingId: fakeNewBooking.id});
    });
})