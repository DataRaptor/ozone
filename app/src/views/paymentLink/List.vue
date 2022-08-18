<template>
  <v-row>
    <v-col cols="12" md="10" class="mx-auto">
      <Loader v-if="state.loading" />

      <template v-else>
        <div class="d-flex mb-5">
          <h5 class="h5">Payment links</h5>
          <v-spacer />
          <v-btn flat variant="text" density="compact" color="primary" @click.stop="toggleModal('new')">
            New payment link
          </v-btn>
        </div>

        <v-text-field
          variant="outlined"
          color="primary"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search payment links..."
        />

        <Loader v-if="state.loading" />
        <template v-else>
          <PaymentLinks
            v-if="paymentLinks.length > 0"
            :paymentLinks="paymentLinks"
            :tokens="tokens"
            :addresses="addresses"
          />
          <Empty v-else message="No payment links yet" />
        </template>
      </template>
    </v-col>
  </v-row>

  <NewPaymentLink :show="state.modals.new" :tokens="tokens" :addresses="addresses" @toggle-modal="toggleModal('new')" />
</template>

<script>
import NewPaymentLink from "../../components/modals/paymentLink/New.vue";
import { onMounted, reactive } from "vue";
import { useAddressStore, useClientStore, usePaymentLinkStore, useTokenStore } from "../../stores";
import { addressService, clientService, paymentLinkService, tokenService } from "../../services";
import { storeToRefs } from "pinia";
import { toast } from "../../utils";
import Loader from "../../components/Loader.vue";
import Empty from "../../components/Empty.vue";
import PaymentLinks from "../../components/tables/PaymentLinks.vue";

export default {
  components: { NewPaymentLink, Loader, Empty, PaymentLinks },
  setup() {
    const { paymentLinks } = storeToRefs(usePaymentLinkStore());
    const { clients } = storeToRefs(useClientStore());
    const { addresses } = storeToRefs(useAddressStore());
    const { tokens } = storeToRefs(useTokenStore());

    const state = reactive({ loading: false, modals: { new: null }, current: {} });

    function toggleModal(p) {
      state.modals[p] = !state.modals[p];
    }

    onMounted(async () => {
      try {
        state.loading = true;
        await Promise.all([
          paymentLinkService.loadPaymentLinks(),
          clientService.loadClients(),
          addressService.loadAddresses(),
          tokenService.loadTokens(),
        ]);
      } catch (e) {
        toast.error(e.message);
      } finally {
        state.loading = false;
      }
    });

    return { state, paymentLinks, addresses, tokens, clients, toggleModal };
  },
};
</script>
