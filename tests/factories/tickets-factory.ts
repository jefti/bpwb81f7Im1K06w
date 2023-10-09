import faker from '@faker-js/faker';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { createRandomId } from './bookings-factory';

export async function createTicketType(isRemote?: boolean, includesHotel?: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote !== undefined ? isRemote : faker.datatype.boolean(),
      includesHotel: includesHotel !== undefined ? includesHotel : faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export function createFakeTicket(enrollmentId:number, status:TicketStatus, isRemote:boolean,includesHotel:boolean):Ticket & {TicketType:TicketType}{
  const ticketTypeId = createRandomId();
  return {
    id:createRandomId(),
    ticketTypeId,
    enrollmentId,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType:{
      id: ticketTypeId,
      name: faker.name.firstName(),
      price: createRandomId(),
      isRemote,
      includesHotel,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}