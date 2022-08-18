<template>
  <v-dialog persistent v-model="show">
    <v-card>
      <v-card-text class="py-5">
        <div class="d-flex">
          <h5 class="h5 mb-6">Add a client</h5>
          <v-spacer />
          <v-btn flat density="compact" icon="mdi-close" @click="$emit('toggle-modal')" />
        </div>

        <v-form @submit.prevent="addClient">
          <v-row>
            <v-col class="py-0" cols="12" md="6">
              <v-label class="mb-3">Client Name</v-label>
              <v-text-field
                v-model="state.input.name"
                type="text"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="Name"
              />
            </v-col>
            <v-col class="py-0" cols="12" md="6">
              <v-label class="mb-3">Client Email</v-label>
              <v-text-field
                v-model="state.input.email"
                type="email"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="Email"
              />
            </v-col>

            <v-col class="py-0" cols="12" md="6">
              <v-label class="mb-3">Phone Number</v-label>
              <v-text-field
                v-model="state.input.phone"
                type="text"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="Phone Number"
              />
            </v-col>

            <v-col class="py-0" cols="12" md="6">
              <v-label class="mb-3">Tax Number</v-label>
              <v-text-field
                v-model="state.input.taxNumber"
                type="text"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="Tax Number"
              />
            </v-col>

            <v-col class="py-0" cols="12">
              <v-label class="mb-3">Address</v-label>
              <v-textarea
                v-model="state.input.line1"
                type="text"
                rows="2"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="Address"
              />
            </v-col>

            <v-col class="py-0" cols="12" md="6">
              <v-label class="mb-3">City</v-label>
              <v-text-field
                v-model="state.input.city"
                type="text"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="City"
              />
            </v-col>

            <v-col class="py-0" cols="12" md="6">
              <v-label class="mb-3">State</v-label>
              <v-text-field
                v-model="state.input.state"
                type="text"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="State"
              />
            </v-col>

            <v-col class="py-0" cols="12" md="6">
              <v-label class="mb-3">Postal/Zip Code</v-label>
              <v-text-field
                v-model="state.input.postalCode"
                type="text"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="Postal/Zip Code"
              />
            </v-col>

            <v-col class="py-0" cols="12" md="6">
              <v-label class="mb-3">Country</v-label>
              <v-select
                v-model="state.input.country"
                :items="state.countries"
                item-title="name"
                item-value="code"
                variant="outlined"
                density="compact"
                color="primary"
                label="Select country"
              />
            </v-col>
            <v-btn block flat type="submit" class="my-5" color="primary">Add Client</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { reactive } from "vue";
import { countries } from "../../../config/countries";
import { clientService } from "../../../services";
import { toast } from "../../../utils";

export default {
  props: ["show"],
  emits: ["toggle-modal"],
  setup(_, ctx) {
    const state = reactive({ input: {}, countries });

    async function addClient() {
      try {
        const res = await clientService.addClient(state.input);
        state.input = {};

        ctx.emit("toggle-modal");
        toast.success(res.message);
      } catch (e) {
        toast.error(e.message);
      }
    }

    return { state, addClient };
  },
};
</script>
