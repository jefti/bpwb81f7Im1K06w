import { TicketsPost, getTickets, getTicketsTypes} from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicketSchema } from "@/schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types',getTicketsTypes)
    .get('/',getTickets)
    .post('/',validateBody(createTicketSchema),TicketsPost)
export {ticketsRouter};