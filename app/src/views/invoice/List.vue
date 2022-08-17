<template>
  <v-row>
    <v-col md="10" cols="12" class="mx-auto">
      <div class="d-flex mb-5">
        <h5 class="h5">Invoices</h5>
        <v-spacer />
        <v-btn flat variant="text" density="compact" color="primary" to="/invoices/new">Create new invoice</v-btn>
      </div>

      <v-text-field
        variant="outlined"
        color="primary"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        label="Search invoices"
        class="mb-3"
      />

      <Loader v-if="state.loading" />
      <template v-else>
        <v-tabs color="primary" v-model="state.tab">
          <v-tab v-for="(tab, i) in state.tabs" :value="i">{{ tab }}</v-tab>
        </v-tabs>

        <SentInvoices v-if="state.invoices.length > 0" :invoices="state.invoices" />
        <Empty message="Ooops... No invoices here yet" v-else />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import { onMounted, reactive, watch } from "vue";
import { storeToRefs } from "pinia";
import { useInvoiceStore } from "../../stores";
import { invoiceService } from "../../services";
import Loader from "../../components/Loader.vue";
import Empty from "../../components/Empty.vue";
import { toast } from "../../utils";
import SentInvoices from "../../components/tables/SentInvoices.vue";

export default {
  components: { Loader, Empty, SentInvoices },

  setup() {
    const { invoices } = storeToRefs(useInvoiceStore());
    const state = reactive({
      tab: null,
      invoices: {},
      loading: false,
      tabs: ["All", "Pending", "Paid", "Approved", "Rejected"],
    });

    onMounted(async () => {
      try {
        state.loading = true;
        await invoiceService.loadInvoices({});

        state.invoices = invoices.value;
      } catch (e) {
        toast.error(e.message);
      } finally {
        state.loading = false;
      }
    });

    watch(
      () => state.tab,
      (tab) => {
        const status = state.tabs[tab];
        if (!status) return;

        if (status === "All") {
          state.invoices = invoices.value;
        } else {
          state.invoices = invoices.value.filter((invoice) => invoice.status === status.toUpperCase());
        }
      }
    );

    return { state, invoices };
  },
};
</script>

<style scoped>
.v-tab {
  justify-content: start;
}
</style>
