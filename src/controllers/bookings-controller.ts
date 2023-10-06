import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { bookingsService } from "@/services";



export async function getBookings(req:AuthenticatedRequest, res:Response){
    const {userId} = req;
    const booking= await bookingsService.getBookingByUserId(userId);
    return res.status(httpStatus.OK).send(booking);
}