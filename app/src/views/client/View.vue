<template>
  <div class="d-flex mb-5">
    <h4 class="h4">{{ client.name }}</h4>
  </div>

  <Loader v-if="state.loading" />
  <v-row v-else>
    <v-col cols="12" md="6">
      <div class="d-flex">
        <h6 class="h6 mb-3">Client Details</h6>
        <v-spacer />
        <v-btn flat variant="text" class="px-0" density="compact" color="primary" @click="toggleModal('edit')">
          <v-icon icon="mdi-pencil-outline" />
          Edit
        </v-btn>
      </div>

      <ul class="list-unstyled">
        <li class="my-2 d-flex justify-space-between">
          <span>Email</span>
          <span>{{ client.email || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Phone Number</span>
          <span>{{ client.phone || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Address</span>
          <span>{{ client.line1 || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>City</span>
          <span>{{ client.city || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>State</span>
          <span>{{ client.state || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Postal Code</span>
          <span>{{ client.postalCode || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Country</span>
          <span>{{ client.country || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Tax Number</span>
          <span>{{ client.taxNumber || "N/A" }}</span>
        </li>
      </ul>
    </v-col>
    <v-col md="6" cols="12">
      <div class="d-flex">
        <h6 class="h6">Client's Activites</h6>
        <v-spacer />
      </div>

      <v-tabs color="primary" v-model="state.tab">
        <v-tab :value="0">Invoices</v-tab>
        <v-tab :value="1">Payments</v-tab>
      </v-tabs>

      <v-window v-model="state.tab">
        <v-window-item :value="0">
          <SentInvoices v-if="invoices.length > 0" :invoices="invoices" />
          <Empty message="Ooops... No invoices here yet" v-else />
        </v-window-item>

        <v-window-item :value="1">
          <Payments v-if="payments.length > 0" :all="true" :payments="payments" />
          <Empty v-else message="No payments yet" />
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>

  <EditClient :show="state.modals.edit" @toggle-modal="toggleModal('edit')" :client="client" />
</template>

<style scoped>
.list-unstyled {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>

<script>
import { onMounted, reactive } from "vue";
import { useClientStore, useInvoiceStore, usePaymentStore } from "../../stores";
import { clientService, invoiceService, paymentService } from "../../services";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import EditClient from "../../components/modals/client/Edit.vue";
import { toast } from "../../utils";
import Loader from "../../components/Loader.vue";
import SentInvoices from "../../components/tables/SentInvoices.vue";
import Empty from "../../components/Empty.vue";
import Payments from "../../components/tables/Payments.vue";

export default {
  components: { EditClient, Loader, SentInvoices, Empty, Payments },
  setup() {
    const route = useRoute();
    const { client } = storeToRefs(useClientStore());
    const { payments } = storeToRefs(usePaymentStore());
    const { invoices } = storeToRefs(useInvoiceStore());
    const state = reactive({ loading: false, tab: null, modals: { edit: null } });

    function toggleModal(p) {
      state.modals[p] = !state.modals[p];
    }

    onMounted(async () => {
      try {
        state.loading = true;
        await Promise.all([
          clientService.loadClient(route.params.id),
          invoiceService.loadInvoices({ clientId: route.params.id }),
          paymentService.getPayments({ clientId: route.params.id }),
        ]);

        console.log(invoices.value);
      } catch (e) {
        toast.error(e.message);
      } finally {
        state.loading = false;
      }
    });

    return { state, client, payments, invoices, toggleModal };
  },
};
</script>
