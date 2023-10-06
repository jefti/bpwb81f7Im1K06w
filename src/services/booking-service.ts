import { notFoundError } from "@/errors";
import { bookingsRepository } from "@/repositories/bookings-repository"

async function getBookingByUserId(userId: number) {
    const booking = await bookingsRepository.findBookingByUserId(userId);

    if(!booking) throw notFoundError();
    
    return booking;
}

export const bookingsService= {
    getBookingByUserId
}