<template>
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

  <v-row>
    <v-col>
      <v-table>
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
        <tbody>
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
    </v-col>
  </v-row>
</template>

<script>
import { onMounted } from "vue"
import { storeToRefs } from "pinia"
import { useInvoiceStore } from "../../stores"
import { invoiceService } from "../../services"

export default {
  setup() {
    const { invoices } = storeToRefs(useInvoiceStore())

    onMounted(async () => {
      await invoiceService.loadInvoices({})
    })

    return { invoices }
  },
}
</script>
