import { storeToRefs } from "pinia"
import { request } from "../config"
import { useAuthStore } from "../stores"

export class AuthService {
  async loadAuthenticatedUser() {
    const authStore = useAuthStore()

    const user = await request.api.get("/users/me")
    authStore.setUserData(user.data)
  }

  async signUp(data) {
    const authStore = useAuthStore()

    let payload = {}
    if (data.mode === "wallet") {
      payload.address = data.publicKey
      payload.signature = data.signature
      payload.messageId = data.messageId
    } else {
      payload.name = data.name
      payload.email = data.email
      payload.password = data.password
    }

    const signup = await request.api.post("/auth/signup", { ...payload, mode: data.mode })
    const user = await request.api.get("/users/me", { headers: { Authorization: `Bearer ${signup.data.token}` } })

    authStore.setAuthData(signup.data.token, user.data)
  }

  async signIn(data) {
    const authStore = useAuthStore()

    let payload = {}
    if (data.mode === "wallet") {
      payload.address = data.publicKey
      payload.signature = data.signature
      payload.messageId = data.messageId
    } else {
      payload.email = data.email
      payload.password = data.password
    }

    const signin = await request.api.post("/auth/signin", { ...payload, mode: data.mode })
    const user = await request.api.get("/users/me", { headers: { Authorization: `Bearer ${signin.data.token}` } })

    authStore.setAuthData(signin.data.token, user.data)
  }
}
