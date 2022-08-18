import { request } from "../config";
import { useInvoiceStore } from "../stores";

export class InvoiceService {
  async saveInvoice(data) {
    const invoice = await request.api.post("/invoices", data);
    return invoice.data;
  }

  async getNextInvoiceNumber(data) {
    const invoiceNextNumber = await request.api.get("/invoices/nextNumber", data);
    return invoiceNextNumber.data;
  }

  async loadInvoices(data) {
    const invoiceStore = useInvoiceStore();

    const invoices = await request.api.get("/invoices", { params: { status: data.status, clientId: data.clientId } });
    invoiceStore.setInvoices(invoices.data);
    return invoices;
  }

  async updateInvoice(id, data) {
    const invoiceStore = useInvoiceStore();

    const invoice = await request.api.put(`/invoices/${id}`, data);
    invoiceStore.updateInvoice(invoice.data);
    return invoice;
  }

  async updateInvoiceStatus(id, data) {
    const invoiceStore = useInvoiceStore();

    const invoice = await request.api.put(`/invoices/${id}/status`, data);
    invoiceStore.updateInvoice(invoice.data);
    return invoice;
  }

  async completeInvoicePayment(id, data) {
    const invoiceStore = useInvoiceStore();

    const invoice = await request.api.put(`/invoices/${id}/complete`, data);
    invoiceStore.updateInvoice(invoice.data);
    return invoice;
  }

  async loadInvoice(id) {
    const invoiceStore = useInvoiceStore();

    const invoice = await request.api.get(`/invoices/${id}`);
    invoiceStore.setInvoice(invoice.data);
    return invoice;
  }

  async getShareToken(id) {
    const result = await request.api.get(`/invoices/${id}/share`);
    return result;
  }

  async sendInvoiceReminder(id) {
    await request.api.post(`/invoices/${id}/reminder`);
  }
}
