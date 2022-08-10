<template>
  <v-row align="center" justify="center" style="height: 99vh">
    <v-col cols="12" md="6">
      <v-card flat>
        <v-card-text>
          <div class="text-center mb-10">
            <h4 class="h4 mb-5">Welcome back</h4>
            <p class="h6">Sign in to get back into your Intercord account</p>
          </div>

          <v-btn flat block variant="tonal" color="primary" class="my-3" @click="toggleModal('connect')">
            Sign in with wallet
          </v-btn>

          <p class="mb-3 text-center">OR</p>

          <v-form @submit.prevent="signIn">
            <div class="my-0">
              <v-label class="mb-2">Email Address</v-label>
              <v-text-field
                v-model="state.input.email"
                type="email"
                density="compact"
                color="primary"
                variant="outlined"
                placeholder="Enter your email address"
              />
            </div>
            <div class="my-0">
              <v-label class="mb-2">Password</v-label>
              <v-text-field
                v-model="state.input.password"
                type="password"
                density="compact"
                color="primary"
                variant="outlined"
                placeholder="Enter your password"
              />
            </div>

            <v-btn type="submit" block flat color="primary">Sign in</v-btn>
          </v-form>

          <div class="mt-5">
            <p class="">
              Don't have an account?
              <v-btn to="/signup" variant="text" density="compact" color="primary" class="py-0">Sign up</v-btn>
            </p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <ConnectModal :show="state.modals.connect" @toggle-modal="toggleModal('connect')" @connect="signIn" />
</template>

<script>
import { reactive } from "vue"
import { useRouter } from "vue-router"
import ConnectModal from "../components/modals/Connect.vue"
import { authService } from "../services"
import { toast } from "../utils"

export default {
  components: { ConnectModal },
  setup() {
    const router = useRouter()
    const state = reactive({ modals: { connect: null }, input: { email: "", password: "" } })

    function toggleModal(modal) {
      state.modals[modal] = !state.modals[modal]
    }

    async function signIn(data) {
      try {
        let payload = {}

        if (!data.address && !data.signature) {
          payload.email = state.input.email
          payload.password = state.input.password
          payload.mode = "email"
        } else {
          payload = { ...data, mode: "wallet" }
        }

        await authService.signIn(payload)
        window.location.href = "/"
      } catch (e) {
        toast.error(e.message)
      }
    }
    return { state, toggleModal, signIn }
  },
}
</script>
