import { thawAccountInstructionData } from "@solana/spl-token";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const usePaymentLinkStore = defineStore("PaymentLink", {
  state: () => ({
    currentId: useLocalStorage("paymentLink", null),
    paymentLinks: [],
    paymentLink: { token: {}, address: {}, company: {}, client: {} },
  }),

  actions: {
    addPaymentLink(paymentLink) {
      this.paymentLinks = [paymentLink, ...this.paymentLinks];
    },

    setPaymentLinks(paymentLinks) {
      this.paymentLinks = paymentLinks;

      this.setPaymentLink(paymentLinks[0]);
    },

    updatePaymentLink(value) {
      const paymentLink = this.paymentLinks.find((c) => c.id === value.id);
      if (!!paymentLink) {
        Object.assign(paymentLink, value);
      } else {
        this.paymentLinks = [value, ...this.paymentLinks];
      }

      this.setPaymentLink(value, true);
    },

    setPaymentLink(paymentLink, force = false) {
      if (paymentLink) {
        if (typeof paymentLink === "string") {
          paymentLink = this.paymentLinks.find((c) => c.id === paymentLink);
        }
        this.paymentLink = paymentLink;

        if (force) {
          this.currentId = paymentLink.id;
        } else {
          const current = this.paymentLinks.find((c) => c.id === this.currentId);
          if (!current) {
            this.currentId = paymentLink.id;
          } else {
            this.paymentLink = current;
          }
        }
      }
    },
  },
});
