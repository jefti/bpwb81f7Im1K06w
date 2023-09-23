import { notFoundError } from "@/errors";
import { findTicketById, findTicketsTypes } from "@/repositories";
import { Ticket, TicketType } from "@prisma/client";

export async function getAllTicketTypes():Promise<TicketType[]>{
    const List: TicketType[] = await findTicketsTypes();
    return List;
}

export async function getUserTickets(id:number){
    const ticket = await findTicketById(id);
    if(!ticket) throw notFoundError();
    return ticket;
}

export async function createTicket(){
    
}