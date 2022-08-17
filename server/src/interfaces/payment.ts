import { PaymentSource } from "@prisma/client";

export interface IInitiatePaymentPayload {
  amount: number;
  clientId?: string;
  companyId: string;
  invoiceId?: string;
  paymentLinkId?: string;
  tokenId: string;
  addressId: string;
  source: PaymentSource;
}

export interface ICompletePaymentPayload {
  id: string;
  data: {
    transactionId: string;
  };
}

export interface IGetPaymentPayload {
  id: string;
}

export interface IGetPaymentsPayload {
  addressId?: string;
  clientId?: string;
}

export type PaymentStatus = "PENDING" | "COMPLETED";
