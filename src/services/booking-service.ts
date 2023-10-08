import { conflictError, notFoundError, unauthorizedError } from "@/errors";
import { bookingsRepository } from "@/repositories/bookings-repository"
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { Booking, Room, TicketStatus } from "@prisma/client";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { noVacancyError } from "@/errors/no-vacancy-error";
import { unauthorizedReservationError } from "@/errors/unauthorized-reservation-error";

async function getBookingByUserId(userId: number) {
    const booking = await bookingsRepository.findBookingByUserId(userId);

    if(!booking) throw notFoundError();
    
    const data = {id:booking.id, Room:booking.Room};
    return data;
}
async function createBooking(userId:number, roomId:number){
    validateUserBooking(userId);
    const roomInformation: RoomInformationParam = await bookingsRepository.findRoomById(roomId);
    if(!roomInformation) throw notFoundError();
    if(roomInformation.capacity - roomInformation.Booking.length <= 0) throw noVacancyError();
    const booking: Booking = await bookingsRepository.createBooking(userId, roomId);
    return {bookingId: booking.id};
}
async function updateBooking(userId:number, roomId:number, bookingId: number){
    validateUserBooking(userId);
    const pastBooking: Booking = await bookingsRepository.findBookingById(bookingId);
    if(!pastBooking) throw unauthorizedReservationError('User doesnt have a previous reservation to update.');
    if(pastBooking.userId !== userId) throw unauthorizedError();
    if(pastBooking.roomId === roomId) throw conflictError("The provided room is already registered in your name.");
    const roomInformation: RoomInformationParam = await bookingsRepository.findRoomById(roomId);
    if(!roomInformation) throw notFoundError();
    if(roomInformation.capacity - roomInformation.Booking.length <= 0) throw noVacancyError();
    const updatedBooking: Booking = await bookingsRepository.updateBooking(bookingId,roomId);
    return {bookingId: updatedBooking.id};    
}

async function validateUserBooking(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
  
    const type = ticket.TicketType;
  
    if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
      throw unauthorizedReservationError('Users ticket insuficient to continue');
    }
  }

export type InputBookingBody = Pick<Booking, "roomId">
export type RoomInformationParam = Room & {
    Booking: Booking[];
};

export const bookingsService= {
    getBookingByUserId,
    createBooking,
    updateBooking
}