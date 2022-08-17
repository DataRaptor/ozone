import { request } from "../config";
import { usePaymentLinkStore } from "../stores";

export class PaymentLinkService {
  async loadPaymentLinks() {
    const paymentLinkStore = usePaymentLinkStore();

    const paymentLinks = await request.api.get("/paymentLinks");
    paymentLinkStore.setPaymentLinks(paymentLinks.data);
  }

  async updatePaymentLink(id, data) {
    const paymentLinkStore = usePaymentLinkStore();

    const paymentLink = await request.api.put(`/paymentLinks/${id}`, data);
    paymentLinkStore.updatePaymentLink(paymentLink.data);
  }

  async newPaymentLink(data) {
    const paymentLinkStore = usePaymentLinkStore();

    const payload = {
      title: data.title,
      amount: data.amount,
      description: data.description,
      redirectUrl: data.redirectUrl,
      tokenId: data.token ? data.token.id : undefined,
      addressId: data.address ? data.address.id : undefined,
    };

    console.log(payload);
    const paymentLink = await request.api.post(`/paymentLinks`, payload);
    paymentLinkStore.updatePaymentLink(paymentLink.data);
  }

  async loadPaymentLink(id) {
    const paymentLinkStore = usePaymentLinkStore();

    const paymentLink = await request.api.get(`/paymentLinks/${id}`);
    paymentLinkStore.setPaymentLink(paymentLink.data);
  }
}
