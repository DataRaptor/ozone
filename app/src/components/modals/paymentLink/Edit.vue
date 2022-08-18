<template>
  <v-dialog persistent v-model="show">
    <v-card>
      <v-card-text class="py-5">
        <div class="d-flex">
          <h5 class="h5 mb-6">Update payment link</h5>
          <v-spacer />
          <v-btn flat density="compact" icon="mdi-close" @click="$emit('toggle-modal')" />
        </div>

        <v-form @submit.prevent="updatePaymentLink">
          <div>
            <v-label class="mb-3">Title</v-label>
            <v-text-field
              v-model="state.input.title"
              type="text"
              variant="outlined"
              density="compact"
              color="primary"
              placeholder="Title"
            />
          </div>

          <div>
            <v-label class="mb-3">Amount (Optional)</v-label>
            <v-text-field
              v-model.number="state.input.amount"
              type="number"
              variant="outlined"
              density="compact"
              color="primary"
              placeholder="Amount"
            />
          </div>

          <div>
            <v-label class="mb-3">Description</v-label>
            <v-textarea
              v-model="state.input.description"
              type="email"
              variant="outlined"
              density="compact"
              color="primary"
              rows="2"
              placeholder="Description"
            />
          </div>

          <div>
            <v-label class="mb-3">Select Token</v-label>
            <v-select
              v-model="state.input.token"
              :items="tokens"
              item-title="name"
              item-value="id"
              type="select"
              variant="outlined"
              density="compact"
              color="primary"
              placeholder="PaymentLink"
              return-object
            />
          </div>

          <div>
            <v-label class="mb-3">Select Address</v-label>
            <v-select
              v-model="state.input.address"
              :items="addresses"
              item-title="label"
              item-value="id"
              type="select"
              variant="outlined"
              density="compact"
              color="primary"
              placeholder="PaymentLink"
              return-object
            />
          </div>

          <div>
            <v-label class="mb-3">Redirect URL (Optional)</v-label>
            <v-text-field
              v-model="state.input.redirectUrl"
              type="text"
              variant="outlined"
              density="compact"
              color="primary"
              placeholder="Redirect URL"
            />
          </div>

          <v-btn block flat type="submit" class="mt-5" color="primary">Update payment link</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { toast } from "../../../utils";
import { paymentLinkService } from "../../../services";
import { reactive, watch } from "vue";

export default {
  props: ["show", "paymentLink", "addresses", "tokens"],
  emits: ["toggle-modal"],
  setup(props, ctx) {
    const state = reactive({ input: { ...props.paymentLink } });

    async function updatePaymentLink() {
      try {
        const res = await paymentLinkService.updatePaymentLink(props.paymentLink.id, state.input);
        ctx.emit("toggle-modal");
        toast.success(res.message);
      } catch (e) {
        toast.error(e.message);
      }
    }

    watch(
      () => props.paymentLink,
      (n, o) => (state.input = { ...o, ...n })
    );

    return { state, updatePaymentLink };
  },
};
</script>
