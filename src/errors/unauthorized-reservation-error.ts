import { ApplicationError } from "@/protocols";

export function unauthorizedReservationError(message:string): ApplicationError{
    return {
        name: 'UnauthorizedReservationError',
        message: message,
    };
}