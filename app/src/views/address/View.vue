<template>
  <v-row>
    <v-col cols="12" class="mx-auto">
      <Loader v-if="state.loading" />

      <template v-else>
        <v-row>
          <v-col md="8" cols="12" class="mx-auto">
            <v-sheet>
              <h6 class="h6 mb-3 font-weight-medium">{{ address.label }}</h6>

              <div class="d-flex">
                <v-btn
                  link
                  class="mb-6 px-0"
                  density="compact"
                  variant="text"
                  target="_blank"
                  :href="`${config.solana.explorerUrl}/address/${address.address}?cluster=${config.solana.env}`"
                >
                  {{ utils.truncateAddress(address.address) }}
                </v-btn>
                <v-btn flat density="compact" size="small" icon="mdi-content-copy" @click="copyItem(address.address)" />
              </div>
            </v-sheet>

            <div>
              <p class="h6">Tokens</p>
              <v-list v-if="address.tokens.length > 0" lines="two">
                <template v-for="(token, i) in address.tokens" :key="i">
                  <v-list-item aspect-ratio="1" class="mb-3" border link prepend-avatar="">
                    <template v-slot:prepend>
                      <v-avatar density="compact" rounded="circle" size="30">
                        <v-img :src="token.logo" :alt="token.name" />
                      </v-avatar>
                    </template>

                    <v-list-item-title class="mb-1">{{ token.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <p>{{ token.amount }} {{ token.symbol }}</p>
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <v-list-item-action>
                        <p class="font-weight-medium">{{ token.amount }} {{ token.symbol }}</p>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
              </v-list>

              <Empty v-else message="No token is available yet" />
            </div>

            <p class="h6 mb-1">Payments</p>

            <Payments v-if="state.payments.length > 0" :payments="state.payments" />
            <Empty v-else message="No payments yet" />
          </v-col>
        </v-row>
      </template>
    </v-col>
  </v-row>

  <NewAddress :show="state.modals.new" @toggle-modal="toggleModal('new')" />
  <EditAddress :show="state.modals.edit" @toggle-modal="toggleModal('edit')" :address="address" />
</template>

<script>
import { onMounted, reactive } from "vue";
import NewAddress from "../../components/modals/address/New.vue";
import EditAddress from "../../components/modals/address/Edit.vue";
import Loader from "../../components/Loader.vue";
import { addressService, paymentService } from "../../services";
import Empty from "../../components/Empty.vue";
import { useRoute } from "vue-router";
import { toast, utils } from "../../utils";
import { storeToRefs } from "pinia";
import { useAddressStore } from "../../stores";
import Payments from "../../components/tables/Payments.vue";
import { config } from "../../config";

export default {
  components: { NewAddress, EditAddress, Loader, Empty, Payments },
  setup() {
    const state = reactive({ loading: false, modals: { edit: null }, payments: [] });
    const route = useRoute();
    const { address } = storeToRefs(useAddressStore());

    function toggleModal(p, data = {}) {
      for (const key in data) {
        state[key] = data[key];
      }

      state.modals[p] = !state.modals[p];
    }

    onMounted(async () => {
      try {
        state.loading = true;
        await addressService.loadAddress(route.params.id);
        const payments = await paymentService.getPayments({ addressId: address.value.id });
        state.payments = payments;
      } catch (e) {
        toast.error(e.message);
      } finally {
        state.loading = false;
      }
    });

    async function copyItem(item) {
      try {
        await utils.copyToClipBoard(item);
        toast.success("Item copied successfuly");
      } catch (e) {
        console.log(e);
      }
    }

    return { state, config, address, utils, toggleModal, copyItem };
  },
};
</script>
