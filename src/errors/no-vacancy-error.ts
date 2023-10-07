import { ApplicationError } from "@/protocols";

export function noVacancyError(): ApplicationError{
    return {
        name: 'NoVacancyError',
        message: 'Room with no vacancies'
    }
}