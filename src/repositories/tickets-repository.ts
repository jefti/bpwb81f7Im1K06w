import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import { CreateTicketData } from '@/services';
import {Enrollment, Ticket, TicketStatus, TicketType } from '@prisma/client';

export async function findTicketsTypes():Promise<TicketType[]>{
    return prisma.ticketType.findMany();
}
export async function findTicketTypeById(id:number){
    return prisma.ticketType.findFirst({where:{id}})
}

export async function findTicketById(enrollmentId:number){
    const ticket: Ticket = await prisma.ticket.findFirst({where:{enrollmentId},include:{TicketType:true}});    
    return ticket;
}

export async function createTicket(ticketTypeId:number,enrollmentId:number){
    const createdAt = new Date();
    const updatedAt = new Date();
    const data: CreateTicketData = {ticketTypeId,enrollmentId,status: TicketStatus.RESERVED,createdAt,updatedAt};
    await prisma.ticket.create({data});
    const ticket = findTicketById(enrollmentId);
    return ticket;
}

export async function getEnrrolmentIdByUserId(userId:number){
    const enrollment:Enrollment = await prisma.enrollment.findFirst({where:{userId}});
    return enrollment;
}