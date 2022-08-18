<template>
  <v-dialog persistent v-model="show">
    <v-card>
      <v-card-text class="py-5">
        <div class="d-flex">
          <h5 class="h5 mb-6">New payment link</h5>
          <v-spacer />
          <v-btn flat density="compact" icon="mdi-close" @click="$emit('toggle-modal')" />
        </div>

        <v-form @submit.prevent="newPaymentLink">
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
              placeholder="Client"
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
              placeholder="Client"
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

          <v-btn block flat :disabled="state.submitted" type="submit" class="mt-5" color="primary"
            >Create payment link</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { toast } from "../../../utils";
import { paymentLinkService } from "../../../services";
import { reactive } from "vue";

export default {
  props: ["show", "addresses", "tokens"],
  emits: ["toggle-modal"],
  setup(_, ctx) {
    const state = reactive({ submitted: false, input: {} });

    async function newPaymentLink() {
      try {
        state.submitted = true;
        const res = await paymentLinkService.newPaymentLink(state.input);
        ctx.emit("toggle-modal");
        toast.success(res.message);
      } catch (e) {
        toast.error(e.message);
      } finally {
        state.submitted = false;
      }
    }

    return { state, newPaymentLink };
  },
};
</script>
