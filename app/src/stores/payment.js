import { thawAccountInstructionData } from "@solana/spl-token";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const usePaymentStore = defineStore("Payment", {
  state: () => ({
    payments: [],
    payment: { token: {}, address: {}, company: {}, client: {} },
  }),

  actions: {
    addPayment(payment) {
      this.payments = [payment, ...this.payments];
    },

    setPayments(payments) {
      this.payments = payments;

      this.setPayment(payments[0]);
    },

    updatePayment(value) {
      const payment = this.payments.find((c) => c.id === value.id);
      if (!!payment) {
        Object.assign(payment, value);
      } else {
        this.payments = [value, ...this.payments];
      }

      this.setPayment(value, true);
    },

    setPayment(payment, force = false) {
      if (payment) {
        if (typeof payment === "string") {
          payment = this.payments.find((c) => c.id === payment);
        }
        this.payment = payment;

        if (force) {
          this.currentId = payment.id;
        } else {
          const current = this.payments.find((c) => c.id === this.currentId);
          if (!current) {
            this.currentId = payment.id;
          } else {
            this.payment = current;
          }
        }
      }
    },
  },
});
