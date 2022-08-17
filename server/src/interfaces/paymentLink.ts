export interface ICreatePaymentLinkPayload {
  amount: number;
  title: string;
  tokenId: string;
  addressId: string;
  invoiceId?: string;
  description: string;
  redirectUrl?: string;
}

// export interface ICompletePaymentPayload {
//   id: string;
//   data: {
//     transactionId: string;
//   };
// }

export interface IGetPaymentLinkPayload {
  id: string;
  token?: string;
}

// export interface IGetPaymentsPayload {
//   addressId?: string;
//   clientId?: string;
// }

// export type PaymentStatus = "PENDING" | "COMPLETED";
