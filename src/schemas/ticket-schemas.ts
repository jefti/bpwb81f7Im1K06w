import { CreateTicketParams } from "@/services";
import Joi from "joi";

export const createTicketSchema = Joi.object<CreateTicketParams>({
    ticketTypeId: Joi.number().integer().min(1).positive().strict().required()
});