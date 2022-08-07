import { defineStore } from "pinia"

export const useClientStore = defineStore("Client", {
  state: () => ({ clients: [], client: {} }),

  actions: {
    addClient(client) {
      this.clients = [client, ...this.clients]
    },

    setClients(clients) {
      this.clients = clients
    },

    updateClient(value) {
      const client = this.clients.find((c) => c.id === value.id)
      if (!!client) {
        Object.assign(client, value)
      }

      this.setClient(value)
    },

    setClient(client) {
      this.client = client
    },
  },
})
