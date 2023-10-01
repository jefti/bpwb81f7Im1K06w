import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRooms(hotelId: number) {
  return prisma.room.createMany({
    data: [
      { name: faker.random.numeric(), capacity: 4, hotelId },
      { name: faker.random.numeric(), capacity: 4, hotelId },
      { name: faker.random.numeric(), capacity: 2, hotelId },
      { name: faker.random.numeric(), capacity: 2, hotelId },
    ],
  });
}

export async function deleteHotelDatabase() {
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
}
