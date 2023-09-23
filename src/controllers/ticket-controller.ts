import { AuthenticatedRequest } from "@/middlewares";
import { createTicket, getAllTicketTypes, getUserTickets } from "@/services";
import { Ticket, TicketType } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: Request, res:Response){
    const List: TicketType[] = await getAllTicketTypes();
    return  res.status(httpStatus.OK).send(List);
}
export async function getTickets(req: Request, res:Response){
    const {userId} = req as AuthenticatedRequest;
    const ticket = await getUserTickets(userId);
    return  res.status(httpStatus.OK).send(ticket);
}
export async function TicketsPost(req: Request, res:Response){
    await createTicket();
    return  res.status(httpStatus.OK).send('Post tickets');
}