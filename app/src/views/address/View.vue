<template>
  <v-row>
    <v-col cols="12" md="10" class="mx-auto">
      <div class="d-flex mb-5">
        <h5 class="h5">Address</h5>
        <v-spacer />
        <!-- <v-btn flat variant="text" density="compact" color="primary" @click="toggleModal('new')">Add an address</v-btn> -->
      </div>

      <Loader v-if="state.loading" />

      <template v-else>
        <v-list v-if="addresses.length > 0" lines="two">
          <template v-for="(address, i) in addresses" :key="i">
            <v-list-item aspect-ratio="1" class="mb-3" border link prepend-avatar="">
              <template v-slot:prepend>
                <v-avatar density="compact" rounded="circle" size="50">
                  <v-img src="/assets/images/solana.svg" />
                </v-avatar>
              </template>

              <v-list-item-title class="mb-1">Solana</v-list-item-title>
              <v-list-item-subtitle>
                <p>3000 SOL</p>
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-list-item-action>
                  <h4>$200000</h4>
                </v-list-item-action>
              </template>
            </v-list-item>
          </template>
        </v-list>

        <Empty v-else message="No address has been added yet" />
      </template>
    </v-col>
  </v-row>
  <NewAddress :show="state.modals.new" @toggle-modal="toggleModal('new')" />
  <EditAddress
    :show="state.modals.edit"
    @toggle-modal="toggleModal('edit', { current: {} })"
    :address="state.current"
  />
</template>

<script>
import { onMounted, reactive } from "vue";
import NewAddress from "../../components/modals/address/New.vue";
import EditAddress from "../../components/modals/address/Edit.vue";
import { storeToRefs } from "pinia";
import { useAddressStore } from "../../stores";
import { addressService } from "../../services";
import { toast } from "../../utils";
import Loader from "../../components/Loader.vue";
import Empty from "../../components/Empty.vue";

export default {
  components: { NewAddress, EditAddress, Loader, Empty },

  setup() {
    const { addresses } = storeToRefs(useAddressStore());
    const state = reactive({
      loading: false,
      modals: { new: null, edit: null },
      current: {},
    });

    function toggleModal(p, data = {}) {
      for (const key in data) {
        state[key] = data[key];
      }

      state.modals[p] = !state.modals[p];
    }

    onMounted(async () => {
      try {
        state.loading = true;
        await addressService.loadAddresses();
      } catch (e) {
        toast.error(e.message);
      } finally {
        state.loading = false;
      }
    });

    return { state, toggleModal, addresses };
  },
};
</script>
