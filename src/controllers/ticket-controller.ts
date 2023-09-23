import { getAllTicketTypes } from "@/services";
import { TicketType } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: Request, res:Response){
    const List: TicketType[] = await getAllTicketTypes();
    return  res.status(httpStatus.OK).send(List);
}
export async function getTickets(req: Request, res:Response){

    return  res.status(httpStatus.OK).send('Get Tickets');
}
export async function TicketsPost(req: Request, res:Response){

    return  res.status(httpStatus.OK).send('Post tickets');
}