import { invalidDataError, notFoundError, paymentRequiredError } from "@/errors";
import { enrollmentRepository, hotelsRepository, ticketsRepository } from "@/repositories";
import { TicketStatus } from "@prisma/client";

async function findHotels(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
    
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if(!ticket.TicketType.includesHotel || ticket.TicketType.isRemote ) throw paymentRequiredError();
    if(ticket.status !== TicketStatus.PAID) throw paymentRequiredError();

    const hotels = await hotelsRepository.findHotels();
    return hotels;
}

async function findHotelsById(userId: number, hotelId:string){
    if(isNaN(Number(hotelId))) throw invalidDataError('hotelId'); 
    
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
    
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if(!ticket.TicketType.includesHotel || ticket.TicketType.isRemote) throw paymentRequiredError();
    if(ticket.status !== TicketStatus.PAID) throw paymentRequiredError();

    const hotels = await hotelsRepository.findHotelById(Number(hotelId));
    return hotels;
}

export const hotelsService = {
    findHotels,
    findHotelsById
};