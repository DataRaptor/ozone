import { request } from "../config"
import { useInvoiceStore } from "../stores"

export class InvoiceService {
  async saveInvoice(data) {
    const invoices = await request.api.post("/invoices", data)
  }

  async loadInvoices(data) {
    const invoiceStore = useInvoiceStore()

    const invoices = await request.api.get("/invoices", { params: { status: data.status } })
    invoiceStore.setInvoices(invoices.data)
  }

  async updateInvoice(id, data) {
    const invoiceStore = useInvoiceStore()

    const invoices = await request.api.put(`/invoices/${id}`, data)
    invoiceStore.updateInvoice(invoices.data)
  }

  async loadInvoice(id) {
    const invoiceStore = useInvoiceStore()

    const invoice = await request.api.get(`/invoices/${id}`)
    invoiceStore.setInvoice(invoice.data)
  }
}
