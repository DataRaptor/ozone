<template>
  <v-row align="center" justify="center" style="height: 99vh">
    <v-col cols="12" md="6">
      <v-card flat>
        <v-card-text>
          <div class="text-center mb-10">
            <h4 class="h4 mb-5">Let's get you started</h4>
            <p class="h6">Sign up to start invoicing and receiving payments from your customers</p>
          </div>

          <v-btn flat block class="my-3" variant="tonal" color="primary" @click="toggleModal('connect')">
            Sign up with wallet
          </v-btn>

          <p class="mb-3 text-center">OR</p>

          <v-form>
            <div class="my-0">
              <v-label class="mb-2">Full Name</v-label>
              <v-text-field
                v-model="state.input.name"
                type="text"
                density="compact"
                color="primary"
                variant="outlined"
                placeholder="John Doe"
              />
            </div>

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
                placeholder="Enter a password"
              />
            </div>

            <v-btn block flat color="primary" @click="signUp">Sign up</v-btn>
          </v-form>

          <div class="mt-5">
            <p class="">
              Already have an account?
              <v-btn to="/signin" variant="text" density="compact" color="primary" class="py-0">Sign in</v-btn>
            </p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <ConnectModal :show="state.modals.connect" @toggle-modal="toggleModal('connect')" @connect="signUp" />
</template>

<script>
import { reactive } from "vue"
import { useRouter } from "vue-router"
import ConnectModal from "../components/modals/Connect.vue"
import { authService } from "../services"
import { toast } from "../utils"

export default {
  components: { ConnectModal },
  setup(_, ctx) {
    const router = useRouter()
    const state = reactive({
      modals: { connect: null },
      input: { name: "", email: "", password: "" },
    })

    function toggleModal(modal) {
      state.modals[modal] = !state.modals[modal]
    }

    async function signUp(data) {
      try {
        let payload = {}

        if (!data.address && !data.signature) {
          payload.name = state.input.name
          payload.email = state.input.email
          payload.password = state.input.password
          payload.mode = "email"
        } else {
          payload = { ...data, mode: "wallet" }
        }

        await authService.signUp(payload)
        window.location.href = "/"
      } catch (e) {
        toast.error(e.message)
      }
    }

    return { state, toggleModal, signUp }
  },
}
</script>
