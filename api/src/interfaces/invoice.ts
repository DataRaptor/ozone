export interface ICreateInvoicePayload {
  title: string
  note?: string
  status: InvoiceStatus
  dueAt: number
  clientId: string
  tokenId: string
  items: ICreateInvoiceItemPayload[]
}

export interface ICreateInvoiceItemPayload {
  description: string
  quantity: number
  price: number
  discount?: number
  tax?: number
  companyId: string
}

export interface IGetInvoicePayload {
  id: string
}

export type InvoiceStatus = "DRAFT" | "UNPAID" | "APPROVED" | "REJECTED" | "PAID"
