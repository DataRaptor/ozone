import { defineStore } from "pinia"

export const useTokenStore = defineStore("Token", {
  state: () => ({ tokens: [] }),

  actions: {
    setTokens(tokens) {
      this.tokens = tokens
    },
  },
})
