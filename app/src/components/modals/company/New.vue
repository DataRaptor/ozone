<template>
  <v-dialog persistent v-model="show">
    <v-card>
      <v-card-text class="py-5">
        <div class="d-flex">
          <h5 class="h5 mb-6">Add new company</h5>
          <v-spacer />
          <v-btn flat density="compact" icon="mdi-close" @click="$emit('toggle-modal')" />
        </div>

        <v-form @submit.prevent="addCompany">
          <v-row>
            <v-col class="py-0" cols="12" md="6">
              <v-label class="mb-3">Name</v-label>
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
              <v-label class="mb-3">Email</v-label>
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
                item-value="code"
                item-title="name"
                variant="outlined"
                density="compact"
                color="primary"
                label="Select country"
              />
            </v-col>
          </v-row>

          <v-btn block flat type="submit" class="mt-5" color="primary">Add Company</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { toast } from "../../../utils";
import { companyService } from "../../../services";
import { reactive } from "vue";
import { countries } from "../../../config/countries";

export default {
  props: ["show"],
  emits: ["toggle-modal"],
  setup(_, ctx) {
    const state = reactive({ input: {}, countries });

    async function addCompany() {
      try {
        await companyService.addCompany(state.input);
        ctx.emit("toggle-modal");
      } catch (e) {
        toast.error(e.message);
      }
    }

    return { state, addCompany };
  },
};
</script>
