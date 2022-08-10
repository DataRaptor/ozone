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
      <v-table v-else>
        <thead>
          <tr>
            <th class="text-left">Invoice Number</th>
            <th class="text-left">Title</th>
            <th class="text-left">Amount</th>
            <th class="text-left">Client</th>
            <th class="text-left">Last Updated</th>
          </tr>
        </thead>
        <tbody v-if="invoices.length > 0">
          <tr v-for="(invoice, i) in invoices" :key="i" @click="() => $router.push(`/invoices/${invoice.id}/edit`)">
            <td>{{ i }}</td>
            <td>{{ invoice.title }}</td>
            <td>{{ invoice.netAmount }} {{ invoice.paymentToken.symbol }}</td>
            <td>{{ invoice.client.name }}</td>
            <td>{{ utils.formatDate(invoice.updatedAt) }}</td>
          </tr>
        </tbody>
      </v-table>
      <Empty message="Ooops... You do not have any draft invoice" v-if="invoices.length < 1" />
    </v-col>
  </v-row>
</template>

<script>
import { storeToRefs } from "pinia"
import { onMounted, reactive } from "vue"
import { invoiceService } from "../../services"
import { useInvoiceStore } from "../../stores"
import { toast, utils } from "../../utils"
import Loader from "../../components/Loader.vue"
import Empty from "../../components/Empty.vue"

export default {
  components: { Loader, Empty },

  setup() {
    const state = reactive({ loading: false })
    const { invoices } = storeToRefs(useInvoiceStore())

    onMounted(async () => {
      try {
        state.loading = true
        await invoiceService.loadInvoices({ status: "DRAFT" })
      } catch (e) {
        toast.error(e.message)
      } finally {
        state.loading = false
      }
    })

    return { state, invoices, utils }
  },
}
</script>
