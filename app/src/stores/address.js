import { defineStore } from "pinia";

export const useAddressStore = defineStore("Address", {
  state: () => ({ addresses: [], address: { tokens: [] } }),

  actions: {
    addAddress(address) {
      this.addresses = [address, ...this.addresses];
    },

    updateAddress(value) {
      const address = this.addresses.find((a) => a.id === value.id);
      if (!!address) {
        Object.assign(address, value);
      }
    },

    setAddress(address) {
      this.address = { ...this.address, ...address };
    },

    setAddresses(addresses) {
      this.addresses = addresses;
    },
  },
});
