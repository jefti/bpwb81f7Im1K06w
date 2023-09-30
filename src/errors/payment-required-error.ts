import { ApplicationError } from "@/protocols";

export function paymentRequiredError(): ApplicationError{
    return {
        name: 'Payment Required',
        message: 'Payment Required!',
      };
}