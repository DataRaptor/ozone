<template>
  <v-dialog persistent v-model="show">
    <v-card>
      <v-card-text class="py-5">
        <div class="mb-10">
          <div class="d-flex">
            <h5 class="h5 mb-6">Payment</h5>
            <v-spacer />
            <v-btn flat density="compact" icon="mdi-close" @click="$emit('toggle-modal')" />
          </div>

          <div class="text-center">
            <template v-if="completed">
              <v-avatar size="100" class="mx-auto">
                <v-icon color="success" size="100" icon="mdi-checkbox-marked-circle-outline" />
              </v-avatar>

              <h5 class="h5">Your payment is successful</h5>
            </template>

            <template v-else>
              <p class="h5 mb-8 px-5">
                Scan the QR Code below to pay make a payment of {{ payment.amount }} {{ symbol }}
              </p>

              <QRCode :payment="payment" />

              <p class="text-small">
                <v-btn flat density="compact" size="small" icon="mdi-information-outline" /> Please do not close this
                page immediately after payment.
              </p>
            </template>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import QRCode from "../QRCode.vue";

export default {
  props: ["show", "payment", "symbol", "completed"],
  emits: ["completed", "toggle-modal"],
  components: { QRCode },
};
</script>
