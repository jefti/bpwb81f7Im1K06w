import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";



export async function getBookings(req:AuthenticatedRequest, res:Response){
    const {userId} = req;

    
    return res.send(httpStatus.OK);
}