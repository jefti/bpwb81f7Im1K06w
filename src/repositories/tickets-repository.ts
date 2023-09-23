import { prisma } from '@/config';
import { notFoundError } from '@/errors';
import {Enrollment, Ticket, TicketStatus, TicketType } from '@prisma/client';

export async function findTicketsTypes():Promise<TicketType[]>{
    return prisma.ticketType.findMany();
}

export async function findTicketById(id:number){
    const enrollment:Enrollment = await prisma.enrollment.findFirst({where:{userId:id}})
    if(!enrollment) throw notFoundError();
    const ticket: Ticket = await prisma.ticket.findFirst({where:{enrollmentId:enrollment.id},include:{TicketType:true}});    
    return ticket;
}