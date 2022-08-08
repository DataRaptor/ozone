<template>
  <v-window v-model="state.window">
    <v-window-item :value="0">
      <v-row>
        <v-col cols="12" md="6" class="mx-auto">
          <div class="mb-3">
            <h5 class="h5">Point Of Sale</h5>
          </div>

          <div class="">
            <div class="">
              <v-label class="mb-2">Select Payment Token</v-label>
              <v-select variant="outlined" density="compact" />
            </div>

            <div class="">
              <v-label class="mb-2">Select Payment Address</v-label>
              <v-select variant="outlined" density="compact" />
            </div>
          </div>

          <div class="d-flex mt-3 mb-3">
            <v-btn flat block color="primary" @click="() => (state.window = 1)">Continue</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1">
      <v-row>
        <v-col md="4" cols="12" class="mx-auto">
          <div class="d-flex mb-3">
            <v-btn flat density="compact" prepend-icon="mdi-arrow-left" class="px-0" @click="() => (state.window = 0)">
              Back
            </v-btn>
            <v-spacer />
          </div>

          <div class="mb-5 text-center screen">
            <p class="mb-2 secondary-text">Enter amount</p>
            <h1 class="h1">{{ state.amount }}</h1>
          </div>

          <v-row>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('1')">
                <h2 class="h2">1</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('2')">
                <h2 class="h2">2</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('3')">
                <h2 class="h2">3</h2>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('4')">
                <h2 class="h2">4</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('5')">
                <h2 class="h2">5</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('6')">
                <h2 class="h2">6</h2>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('7')">
                <h2 class="h2">7</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('8')">
                <h2 class="h2">8</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('9')">
                <h2 class="h2">9</h2>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('.')">
                <h2 class="h2">.</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('0')">
                <h2 class="h2">0</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="ma-3" variant="tonal" @click="() => input('del')">
                <h2 class="h2"><v-icon icon="mdi-close" /></h2>
              </v-btn>
            </v-col>
          </v-row>

          <div class="d-flex mt-10 mb-3">
            <v-btn flat block color="primary">Continue</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-window-item>
  </v-window>
</template>

<script>
import { reactive } from "vue"

export default {
  setup() {
    const state = reactive({ window: null, amount: "0" })

    function input(value) {
      if (value === "del") {
        if (state.amount !== "0") {
          const result = state.amount.substring(0, state.amount.length - 1)
          state.amount = result === "" ? "0" : result
        }
      } else {
        if (value === "." && state.amount.includes(value)) return
        if (value !== "." && isNaN(Number(value))) return
        if (state.amount === "0" && Number(value) === 0) return
        if (state.amount === "0" && value !== ".") {
          state.amount = value
        } else {
          state.amount += value
        }
      }
    }

    onMounted(async () => {
      try {
        state.loading = true
        await Promise.all([addressService.loadAddresses(), tokenService.loadTokens()])
        state.loading = false
      } catch (e) {
        toast.error(e)
      }
    })

    return { state, input }
  },
}
</script>
<style scoped>
.v-col .v-btn {
  border-radius: 50%;
  height: 80px;
  width: 80px;
}
</style>
