import { defineStore } from "pinia";
import { tally, utils, web3 } from "../utils";

export const useInvoiceStore = defineStore("Invoice", {
  state: () => ({
    invoices: [],
    invoice: { client: {}, company: {}, paymentToken: {}, paymentAddress: {}, items: [] },
  }),

  actions: {
    setInvoices(invoices) {
      invoices = invoices.map((invoice) => ({
        ...invoice,
        netAmount: web3.fromDecimals(invoice.netAmount, invoice.paymentToken.decimals),
      }));

      this.invoices = invoices;
    },

    setInvoice(invoice) {
      invoice.dueAt = utils.formatDate(invoice.dueAt, "yyyy-MM-dd");
      invoice.issuedAt = utils.formatDate(invoice.issuedAt, "yyyy-MM-dd");

      invoice.items.forEach((item) => {
        const amounts = tally.getItemAmounts(item);
        const data = {
          amountWithoutTax: web3.fromDecimals(amounts.amountWithoutTax, invoice.paymentToken.decimals),
          netAmount: web3.fromDecimals(amounts.netAmount, invoice.paymentToken.decimals),
          taxAmount: web3.fromDecimals(amounts.taxAmount, invoice.paymentToken.decimals),
        };

        item.price = web3.fromDecimals(item.price, invoice.paymentToken.decimals);
        Object.assign(item, data);
      });

      const amounts = tally.sumTotalAmounts(invoice.items);
      const data = {
        amountWithoutTax: amounts.amountWithoutTax,
        netAmount: amounts.netAmount,
        totalTaxAmount: amounts.totalTaxAmount,
      };

      Object.assign(invoice, data);
      this.invoice = invoice;
    },

    updateInvoice(value) {
      const company = this.invoices.find((c) => c.id === value.id);
      if (!!company) {
        Object.assign(company, value);
      }

      this.setInvoice(value);
    },
  },
});
