import { prisma } from "@/config";
import { RoomInformationParam } from "@/services";
import faker from "@faker-js/faker";
import { Booking, Room } from "@prisma/client";

export async function createBooking(userId:number, roomId:number): Promise<Booking>{
    return prisma.booking.create({
        data:{
            userId,
            roomId
        },
    });
}

export function createBookingObject(bookingId = createRandomId(),userId = createRandomId(),roomId = createRandomId()):fakeBookingObject{
    return {
        id: bookingId,
        userId,
        roomId,
        createdAt: new Date(),
        updatedAt: new Date(),
        Room:{
            id: roomId,
            name: faker.name.firstName(),
            capacity: 2,
            hotelId: createRandomId(),
            createdAt: new Date(),
            updatedAt: new Date(),            
        } 
    }
}

export function createFakeRoom(roomId:number, capacity:number,hotelId:number,registeredBookings:number):RoomInformationParam{
    let Booking:Booking[] = [];
    for(let i = 0;i<registeredBookings;i++){
        const booking:Booking ={id: createRandomId(),userId: createRandomId(),roomId,createdAt: new Date(),updatedAt: new Date()};
        Booking.push(booking);
    }
    return {
        id:roomId,
        name: faker.name.firstName(),
        capacity,
        hotelId,
        createdAt: new Date(),
        updatedAt: new Date(),
        Booking
    }
}
export function createFakeBooking(userId:number, roomId:number):Booking{
    return {
        id: createRandomId(),
        userId,
        roomId,
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

export function createRandomId():number{
    const fakeId:number = Math.floor(Math.random()*(10000000) + 1);
    return fakeId;
}
export type fakeBookingObject = Booking & {Room:Room};