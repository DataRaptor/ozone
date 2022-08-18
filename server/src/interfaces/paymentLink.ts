export interface ICreatePaymentLinkPayload {
  amount: number;
  title: string;
  tokenId: string;
  addressId: string;
  invoiceId?: string;
  description: string;
  redirectUrl?: string;
}

export interface IUpdatePaymentLinkPayload {
  id: string;
  data: ICreatePaymentLinkPayload;
}

export interface IGetPaymentLinkPayload {
  id: string;
  token?: string;
}

// export interface IGetPaymentsPayload {
//   addressId?: string;
//   clientId?: string;
// }

// export type PaymentStatus = "PENDING" | "COMPLETED";
