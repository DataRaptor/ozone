import { defineStore } from "pinia"

export const useAddressStore = defineStore("Address", {
  state: () => ({ addresses: [] }),

  actions: {
    addAddress(address) {
      this.addresses = [address, ...this.addresses]
    },

    updateAddress(value) {
      const address = this.addresses.find((a) => a.id === value.id)
      if (!!address) {
        Object.assign(address, value)
      }
    },

    setAddresses(addresses) {
      this.addresses = addresses
    },
  },
})
