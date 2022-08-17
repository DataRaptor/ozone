import { request } from "../config";
import { usePaymentStore } from "../stores";

export class PaymentService {
  async initiatePayment(data) {
    const payload = {
      amount: data.amount,
      source: data.source,
      clientId: data.clientId,
      companyId: data.companyId,
      tokenId: data.tokenId,
      addressId: data.addressId,
      invoiceId: data.invoiceId,
      paymentLinkId: data.paymentLinkId,
    };

    const payment = await request.api.post(`/payments`, payload);
    return payment.data;
  }

  async completePayment(id, data) {
    const payload = { transactionId: data.transactionId };

    const payment = await request.api.put(`/payments/${id}/complete`, payload);
    return payment.data;
  }

  async getPayments(data) {
    const paymentStore = usePaymentStore();
    const payload = { addressId: data.addressId, clientId: data.clientId };

    const payments = await request.api.get(`/payments`, { params: { ...payload } });

    paymentStore.setPayments(payments.data);

    return payments.data;
  }
}
