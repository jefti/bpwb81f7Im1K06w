import { findTicketsTypes } from "@/repositories";
import { TicketType } from "@prisma/client";

export async function getAllTicketTypes():Promise<TicketType[]>{
    const List: TicketType[] = await findTicketsTypes();
    return List;
}