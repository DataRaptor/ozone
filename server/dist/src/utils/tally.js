"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tally = void 0;
exports.tally = {
    getItemAmounts(data) {
        let tax = Number(data.tax);
        let price = Number(data.price);
        let discount = Number(data.discount);
        let quantity = Number(data.quantity);
        tax = isNaN(tax) ? 0 : tax;
        price = isNaN(price) ? 0 : price;
        discount = isNaN(discount) ? 0 : discount;
        quantity = isNaN(quantity) ? 0 : quantity;
        const initialAmount = quantity * price;
        const discountAmount = (discount / 100) * initialAmount;
        const amountWithoutTax = initialAmount - discountAmount;
        const taxAmount = (tax / 100) * amountWithoutTax;
        const netAmount = amountWithoutTax + taxAmount;
        return { initialAmount, amountWithoutTax, taxAmount, netAmount };
    },
    sumTotalAmounts(items) {
        const netAmount = items.reduce((a, b) => {
            const value = isNaN(Number(b.netAmount)) ? 0 : Number(b.netAmount);
            return a + value;
        }, 0);
        const amountWithoutTax = items.reduce((a, b) => {
            const value = isNaN(Number(b.amountWithoutTax)) ? 0 : Number(b.amountWithoutTax);
            return a + value;
        }, 0);
        const totalTaxAmount = items.reduce((a, b) => {
            const value = isNaN(Number(b.taxAmount)) ? 0 : Number(b.taxAmount);
            return a + value;
        }, 0);
        return { netAmount, amountWithoutTax, totalTaxAmount };
    },
};
