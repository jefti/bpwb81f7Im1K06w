import { Router } from "express";
import { authenticateToken } from "@/middlewares";


const bookingsRouter =  Router();
bookingsRouter
    .all('/*', authenticateToken)
    .get('/')

export {bookingsRouter};