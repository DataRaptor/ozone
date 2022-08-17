<template>
  <v-row>
    <v-col md="10" cols="12" class="mx-auto">
      <div class="d-flex mb-5">
        <h5 class="h5">Draft Invoices</h5>
        <v-spacer />
        <v-btn flat variant="text" density="compact" color="primary" to="/invoices/new">Create new invoice</v-btn>
      </div>

      <v-text-field
        variant="outlined"
        color="primary"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        label="Search invoices"
      />

      <Loader v-if="state.loading" />
      <template v-else>
        <DraftInvoices :invoices="invoices" v-if="invoices.length > 0" />
        <Empty message="Ooops... You do not have any draft invoice" v-else />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";
import { invoiceService } from "../../services";
import { useInvoiceStore } from "../../stores";
import { toast } from "../../utils";
import Loader from "../../components/Loader.vue";
import Empty from "../../components/Empty.vue";
import DraftInvoices from "../../components/tables/DraftInvoices.vue";

export default {
  components: { Loader, Empty, DraftInvoices },

  setup() {
    const state = reactive({ loading: false });
    const { invoices } = storeToRefs(useInvoiceStore());

    onMounted(async () => {
      try {
        state.loading = true;
        await invoiceService.loadInvoices({ status: "DRAFT" });
      } catch (e) {
        toast.error(e.message);
      } finally {
        state.loading = false;
      }
    });

    return { state, invoices };
  },
};
</script>
