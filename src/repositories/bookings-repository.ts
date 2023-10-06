import { prisma } from "@/config";


async function findBookingByUserId(userId: number){
    const result = await prisma.booking.findUnique({
        where:{userId},
        include:{Room: true}
    });

    return result;
}

export const bookingsRepository = {
    findBookingByUserId
};
