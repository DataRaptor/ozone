import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"

export const useAuthStore = defineStore("Auth", {
  state: () => ({
    token: useLocalStorage("token", null),
    user: { name: null, email: null, address: null, avatar: null },
    company: {},
  }),

  actions: {
    setAuthData(token, user) {
      this.token = token
      this.setUserData(user)
    },

    setUserData(user) {
      this.user = { ...this.user, ...user }
    },
  },
})
