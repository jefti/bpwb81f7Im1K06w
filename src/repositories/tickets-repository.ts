import { prisma } from '@/config';
import { TicketType } from '@prisma/client';

export async function findTicketsTypes():Promise<TicketType[]>{
    return prisma.ticketType.findMany();
}