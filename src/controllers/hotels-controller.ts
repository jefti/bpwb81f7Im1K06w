import { AuthenticatedRequest } from "@/middlewares";
import { hotelsService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req:AuthenticatedRequest, res:Response){
    const { userId } = req;
    const hotels = await hotelsService.findHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelById(req:AuthenticatedRequest, res:Response){
    const { userId } = req;
    const {hotelId} = req.params;
    const hotels = await hotelsService.findHotelsById(userId, hotelId);
    return res.status(httpStatus.OK).send(hotels);
}