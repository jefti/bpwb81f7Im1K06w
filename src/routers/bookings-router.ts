import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { changeRoomBooking, createRoomBooking, getBookings } from "@/controllers";
import { bookingSchema } from "@/schemas/booking-schema";


const bookingsRouter =  Router();
bookingsRouter
    .all('/*', authenticateToken)
    .get('/', getBookings)
    .post('/', validateBody(bookingSchema) ,createRoomBooking)
    .put('/:bookingId', validateBody(bookingSchema) ,changeRoomBooking)

export {bookingsRouter};