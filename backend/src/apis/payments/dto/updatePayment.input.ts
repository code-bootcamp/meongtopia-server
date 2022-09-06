import { InputType, PartialType } from "@nestjs/graphql";
import { CreatePaymentInput } from "./createPayment.input";

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {}
