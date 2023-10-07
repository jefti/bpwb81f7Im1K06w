import { prisma } from "@/config";
import { RoomInformationParam } from "@/services";
import { Booking } from "@prisma/client";


async function findBookingByUserId(userId: number){
    const result = await prisma.booking.findUnique({
        where:{userId},
        include:{Room: true}
    });

    return result;
}
async function findBookingById(bookingId: number){
    const result = await prisma.booking.findUnique({
        where:{id:bookingId}
    });
    return result;
}
async function findRoomById(roomId: number): Promise<RoomInformationParam>{
    const result = await prisma.room.findUnique({
        where:{id:roomId},
        include:{Booking:true}
    });
    return result;
}

async function createBooking(userId:number, roomId: number) {
    const booking:Booking = await prisma.booking.create({data:{userId,roomId}});
    return booking;
}

async function updateBooking(bookingId:number, roomId:number){
    const booking:Booking = await prisma.booking.update({
        where:{
            id: bookingId
        },
        data:{
            roomId
        }
    });
    return booking;
}
export const bookingsRepository = {
    findBookingByUserId,
    findBookingById,
    findRoomById,
    createBooking,
    updateBooking
};
