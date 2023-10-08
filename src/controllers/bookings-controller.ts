import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { InputBookingBody, bookingsService } from "@/services";
import { invalidDataError } from "@/errors";



export async function getBookings(req:AuthenticatedRequest, res:Response){
    const {userId} = req;
    const booking= await bookingsService.getBookingByUserId(userId);
    return res.status(httpStatus.OK).send(booking);
}

export async function createRoomBooking(req:AuthenticatedRequest, res:Response){
    const {userId} = req;
    const {roomId} = req.body as InputBookingBody;
    const response = await bookingsService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send(response);
}

export async function changeRoomBooking(req:AuthenticatedRequest, res:Response){
    const {userId} = req;
    if(isNaN(Number(req.params.bookingId)) || Number(req.params.bookingId) <= 0) throw invalidDataError('bookingId');
    const bookingId = Number(req.params.bookingId);
    const {roomId} = req.body as InputBookingBody;
    const response = await bookingsService.updateBooking(userId, roomId,bookingId);
    return res.status(httpStatus.OK).send(response);
}