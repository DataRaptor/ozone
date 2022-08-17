import * as dateFns from "date-fns";

export const utils = {
  formatDate(date, format = "dd MMM yyyy") {
    date = !!date ? new Date(date) : new Date();
    return dateFns.format(date, format);
  },

  addDays(date, days) {
    date = !!date ? new Date(date) : new Date();
    return dateFns.addDays(date, days);
  },

  truncateAddress(address) {
    const regex = /^([a-zA-Z0-9]{6})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

    if (!address) return;
    const match = address.match(regex);
    if (!match) return address;

    return `${match[1]}…${match[2]}`;
  },

  async copyToClipBoard(data) {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(data);
  },
};
