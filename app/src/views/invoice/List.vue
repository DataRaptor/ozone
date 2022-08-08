<template>
  <v-row>
    <v-col md="10" cols="12" class="mx-auto">
      <div class="d-flex mb-5">
        <h5 class="h5">Invoices</h5>
        <v-spacer />
        <v-btn flat variant="text" density="compact" color="primary">Create an invoice</v-btn>
      </div>

      <v-row class="mt-3">
        <v-col class="py-0" md="6" cols="12">
          <v-text-field
            variant="outlined"
            color="primary"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            label="Search invoices"
          />
        </v-col>

        <v-col class="py-0" md="6" cols="12">
          <v-select
            variant="outlined"
            color="primary"
            density="compact"
            prepend-inner-icon="mdi-filter-outline"
            label="Filter invoices by status"
          />
        </v-col>
      </v-row>

      <template v-if="state.loading">
        <Loader />
      </template>

      <template v-else>
        <v-table class="mt-3">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Client</th>
              <th>Creation Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody v-if="invoices.length > 0">
            <tr v-for="(invoice, i) in invoices" :key="i" @click="() => $router.push(`/invoices/${invoice.id}`)">
              <td>{{ i }}</td>
              <td>{{ invoice.title }}</td>
              <td>{{ invoice.netAmount }} {{ invoice.paymentToken.symbol }}</td>
              <td>{{ invoice.client.name }}</td>
              <td>{{ invoice.issuedAt }}</td>
              <td><v-chip label color="success">Paid</v-chip></td>
            </tr>
          </tbody>
        </v-table>
        <Empty message="Ooops... No sent invoices yet" v-if="invoices.length < 1" />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import { onMounted, reactive } from "vue"
import { storeToRefs } from "pinia"
import { useInvoiceStore } from "../../stores"
import { invoiceService } from "../../services"
import Loader from "../../components/Loader.vue"
import Empty from "../../components/Empty.vue"

export default {
  components: { Loader, Empty },

  setup() {
    const { invoices } = storeToRefs(useInvoiceStore())
    const state = reactive({ loading: false })

    onMounted(async () => {
      state.loading = true
      await invoiceService.loadInvoices({})
      state.loading = false
    })

    return { state, invoices }
  },
}
</script>
