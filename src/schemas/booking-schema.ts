import { InputBookingBody } from "@/services";
import Joi from "joi";



export const bookingSchema = Joi.object<InputBookingBody>({
    roomId: Joi.number().integer().min(1).required()
})