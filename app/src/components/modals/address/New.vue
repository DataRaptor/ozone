<template>
  <v-dialog persistent v-model="show">
    <v-card>
      <v-card-text class="py-5">
        <div class="d-flex">
          <h5 class="h5 mb-6">Add an Address</h5>
          <v-spacer />
          <v-btn flat density="compact" icon="mdi-close" @click="$emit('toggle-modal')" />
        </div>

        <v-form @submit.prevent="addAddress">
          <v-row>
            <v-col class="py-0" cols="12">
              <v-label class="mb-3">Label</v-label>
              <v-text-field
                v-model="state.input.label"
                type="text"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="Label"
              />
            </v-col>
            <v-col class="py-0" cols="12">
              <v-label class="mb-3">Address</v-label>
              <v-text-field
                v-model="state.input.address"
                type="text"
                variant="outlined"
                density="compact"
                color="primary"
                placeholder="Address"
              />
            </v-col>
          </v-row>

          <v-btn block flat type="submit" class="mt-5" color="primary">Add Address</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { reactive } from "vue";
import { addressService } from "../../../services";
import { toast } from "../../../utils";

export default {
  props: ["show"],
  emits: ["toggle-modal"],
  setup(_, ctx) {
    const state = reactive({ input: {} });

    async function addAddress() {
      try {
        const res = await addressService.addAddress(state.input);
        state.input = {};

        ctx.emit("toggle-modal");
        toast.success(res.message);
      } catch (e) {
        toast.error(e.message);
      }
    }

    return { state, addAddress };
  },
};
</script>
