<template>
  <v-window v-model="state.window">
    <v-window-item :value="0">
      <v-row>
        <v-col cols="12" md="6" class="mx-auto">
          <div class="mb-3">
            <h5 class="h5">Point Of Sale</h5>
          </div>

          <p class="mb-5">Receive payments from your customers In-Person through the Point Of Sale System</p>

          <div class="">
            <div class="">
              <v-label class="mb-2">Select Payment Token</v-label>
              <v-select
                v-model="state.input.token"
                :items="tokens"
                :item-value="id"
                item-title="name"
                variant="outlined"
                density="compact"
                return-object
              />
            </div>

            <div class="">
              <v-label class="mb-2">Select Payment Address</v-label>
              <v-select
                v-model="state.input.address"
                :items="addresses"
                :item-value="id"
                item-title="label"
                variant="outlined"
                density="compact"
                return-object
              />
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
            <h1 class="h1">{{ state.input.amount }}</h1>
          </div>

          <v-row>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('1')">
                <h2 class="h2">1</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('2')">
                <h2 class="h2">2</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('3')">
                <h2 class="h2">3</h2>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('4')">
                <h2 class="h2">4</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('5')">
                <h2 class="h2">5</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('6')">
                <h2 class="h2">6</h2>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('7')">
                <h2 class="h2">7</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('8')">
                <h2 class="h2">8</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('9')">
                <h2 class="h2">9</h2>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('.')">
                <h2 class="h2">.</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('0')">
                <h2 class="h2">0</h2>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn rounded flat class="d-block mx-auto ma-3" variant="tonal" @click="() => input('del')">
                <h2 class="h2"><v-icon icon="mdi-close" /></h2>
              </v-btn>
            </v-col>
          </v-row>

          <div class="d-flex mt-10 mb-3">
            <v-btn flat block color="primary" @click="makePayment">Continue</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-window-item>
  </v-window>

  <PayModal
    :show="state.modals.pay"
    :payment="state.payment"
    :symbol="state.token.symbol"
    @toggle-modal="toggleModal('pay')"
    :completed="state.completed"
  />
</template>

<script>
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";
import { solanapay, toast } from "../../utils";
import { addressService, tokenService, paymentService } from "../../services";
import { useAddressStore, useCompanyStore, useTokenStore } from "../../stores";
import PayModal from "../../components/modals/Pay.vue";

export default {
  components: { PayModal },
  setup() {
    const state = reactive({
      window: null,
      input: { amount: "0" },
      payment: {},
      token: {},
      modals: { pay: null },
    });

    const { addresses } = storeToRefs(useAddressStore());
    const { company } = storeToRefs(useCompanyStore());
    const { tokens } = storeToRefs(useTokenStore());

    function input(value) {
      if (value === "del") {
        if (state.input.amount !== "0") {
          const result = state.input.amount.substring(0, state.input.amount.length - 1);
          state.input.amount = result === "" ? "0" : result;
        }
      } else {
        if (value === "." && state.input.amount.includes(value)) return;
        if (value !== "." && isNaN(Number(value))) return;
        if (state.input.amount === "0" && Number(value) === 0) return;
        if (state.input.amount === "0" && value !== ".") {
          state.input.amount = value;
        } else {
          state.input.amount += value;
        }
      }
    }
    async function makePayment() {
      const address = state.input.address || {};
      const token = state.input.token || {};
      const initData = {
        source: "POS",
        tokenId: token.id,
        addressId: address.id,
        companyId: company.value.id,
        amount: state.input.amount,
      };
      const payment = await paymentService.initiatePayment(initData);
      const amount = payment.amount / Math.pow(10, payment.token.decimals);

      state.token = token;
      state.payment = {
        amount,
        label: company.value.name,
        reference: payment.reference,
        token: payment.token.address,
        recipient: payment.address.address,
        message: `Payment of ${amount} ${payment.token.symbol}`,
      };

      solanapay.waitForPayment(
        { reference: payment.reference, recipient: address.address, splToken: token.address, amount },
        async (signature) => {
          await paymentService.completePayment(payment.id, { transactionId: signature });

          state.completed = true;
        }
      );

      toggleModal("pay");
      state.window = 0;
    }

    function toggleModal(p) {
      state.modals[p] = !state.modals[p];
    }

    onMounted(async () => {
      try {
        state.loading = true;
        await Promise.all([addressService.loadAddresses(), tokenService.loadTokens()]);
      } catch (e) {
        toast.error(e.message);
      } finally {
        state.loading = false;
      }
    });

    return { state, tokens, addresses, input, makePayment, toggleModal };
  },
};
</script>
<style scoped>
.v-col .v-btn {
  border-radius: 50%;
  height: 80px;
  width: 80px;
}
</style>
