<template>
  <v-row align="center" justify="center" style="height: 99vh">
    <v-col cols="12" md="6" class="mx-auto">
      <Loader v-if="state.loading" />
      <v-card v-else>
        <v-card-text class="py-10">
          <div class="my-10 text-center">
            <h5 class="h5 mb-3">{{ paymentLink.title }}</h5>
            <p>{{ paymentLink.description }}</p>
          </div>

          <v-divider />

          <div class="my-10">
            <div class="text-center">
              <p>
                By making this payment, <strong>{{ paymentLink.company.name }}</strong> will receive the amount of:
              </p>

              <div class="mb-6 mt-3">
                <v-text-field
                  v-if="paymentLink.amount == '0'"
                  class="mt-5"
                  color="primary"
                  variant="outlined"
                  density="compact"
                  placeholder="Enter an amount"
                  v-model.number="state.input.amount"
                >
                  <template v-slot:append-inner>{{ paymentLink.token.symbol }}</template>
                </v-text-field>

                <h4 v-else class="h4">
                  {{ paymentLink.amount / Math.pow(10, paymentLink.token.decimals) }} {{ paymentLink.token.symbol }}
                </h4>
              </div>
              <v-btn flat block :disabled="state.submitted" color="primary" @click="makePayment">Pay Now</v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

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
import { useRoute } from "vue-router";
import PayModal from "../../components/modals/Pay.vue";
import { paymentLinkService, paymentService } from "../../services";
import { usePaymentLinkStore } from "../../stores";
import { solanapay, utils } from "../../utils";
import Loader from "../../components/Loader.vue";

export default {
  components: { PayModal, Loader },
  setup() {
    const { paymentLink } = storeToRefs(usePaymentLinkStore());
    const route = useRoute();
    const state = reactive({ submitted: false, modals: { pay: null }, payment: {}, token: {}, input: {} });

    async function makePayment() {
      state.submitted = true;

      const token = paymentLink.value.token;
      const address = paymentLink.value.address;
      const company = paymentLink.value.company;
      const client = paymentLink.value.client || {};

      const amount =
        paymentLink.value.amount == "0" ? state.input.amount : paymentLink.value.amount / Math.pow(10, token.decimals);

      const initData = {
        source: "LINK",
        paymentLinkId: paymentLink.value.id,
        tokenId: token.id,
        clientId: client.id,
        companyId: company.id,
        addressId: address.id,
        amount,
      };

      const payment = await paymentService.initiatePayment(initData);

      state.token = token;
      state.payment = {
        amount,
        label: company.name,
        reference: payment.reference,
        token: token.address,
        recipient: address.address,
        message: `Payment of ${amount} ${token.symbol}`,
      };

      solanapay.waitForPayment(
        { reference: payment.reference, recipient: address.address, splToken: token.address, amount },
        async (signature) => {
          await paymentService.completePayment(payment.id, { transactionId: signature });

          state.completed = true;

          if (paymentLink.value.redirectUrl) {
            window.location.href = paymentLink.value.redirectUrl;
          }

          state.submitted = false;
        }
      );

      toggleModal("pay");
    }

    function toggleModal(p) {
      state.modals[p] = !state.modals[p];
    }

    onMounted(async () => {
      state.loading = true;
      await paymentLinkService.loadPaymentLink(route.params.id);
      state.loading = false;
    });

    return { state, utils, paymentLink, makePayment, toggleModal };
  },
};
</script>
