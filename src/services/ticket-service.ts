import { conflictError, notFoundError } from "@/errors";
import { createTicket, findTicketById, findTicketTypeById, findTicketsTypes, getEnrrolmentIdByUserId } from "@/repositories";
import { Enrollment, Ticket, TicketType } from "@prisma/client";

export type CreateTicketParams = Pick<Ticket,"ticketTypeId">
export type CreateTicketData = Omit<Ticket,"id">

export async function getAllTicketTypes():Promise<TicketType[]>{
    const List: TicketType[] = await findTicketsTypes();
    return List;
}

export async function getUserTickets(id:number){
    const enrollment:Enrollment = await getEnrrolmentIdByUserId(id);
    if(!enrollment) throw notFoundError();
    const ticket = await findTicketById(enrollment.id);
    if(!ticket) throw notFoundError();
    return ticket;
}

export async function createTicketService(userId:number,ticketTypeId:number){
    const enrollment:Enrollment = await getEnrrolmentIdByUserId(userId);
    if(!enrollment) throw notFoundError();
    const hasTicket: Ticket = await findTicketById(enrollment.id);
    if(hasTicket) throw conflictError("Cannot have more than 1 ticket per user.");
    const ticketType = await findTicketTypeById(ticketTypeId);
    if(!ticketType) throw notFoundError();
    const createdTicket = await createTicket(ticketTypeId,enrollment.id);
    return createdTicket;     
}