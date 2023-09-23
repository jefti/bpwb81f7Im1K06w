import { TicketsPost, getTickets, getTicketsTypes} from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types',getTicketsTypes)
    .get('/',getTickets)
    .post('/',TicketsPost)
export {ticketsRouter};