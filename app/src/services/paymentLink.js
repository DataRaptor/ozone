import { request } from "../config";
import { usePaymentLinkStore } from "../stores";

export class PaymentLinkService {
  async loadPaymentLinks() {
    const paymentLinkStore = usePaymentLinkStore();

    const paymentLinks = await request.api.get("/paymentLinks");
    paymentLinkStore.setPaymentLinks(paymentLinks.data);
    return paymentLinks;
  }

  async updatePaymentLink(id, data) {
    const paymentLinkStore = usePaymentLinkStore();

    const payload = {
      title: data.title,
      amount: data.amount,
      description: data.description,
      redirectUrl: data.redirectUrl,
      tokenId: data.token ? data.token.id : undefined,
      addressId: data.address ? data.address.id : undefined,
    };

    const paymentLink = await request.api.put(`/paymentLinks/${id}`, payload);
    paymentLinkStore.updatePaymentLink(paymentLink.data);
    return paymentLink;
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

    const paymentLink = await request.api.post(`/paymentLinks`, payload);
    paymentLinkStore.updatePaymentLink(paymentLink.data);
    return paymentLink;
  }

  async loadPaymentLink(id) {
    const paymentLinkStore = usePaymentLinkStore();

    const paymentLink = await request.api.get(`/paymentLinks/${id}`);
    paymentLinkStore.setPaymentLink(paymentLink.data);
    return paymentLink;
  }
}
