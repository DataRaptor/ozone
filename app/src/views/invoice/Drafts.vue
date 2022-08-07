<template>
  <div class="d-flex mb-5">
    <h5 class="h5">Draft Invoices</h5>
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
  </v-row>

  <v-row>
    <v-col>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Invoice Number</th>
            <th class="text-left">Title</th>
            <th class="text-left">Amount</th>
            <th class="text-left">Client</th>
            <th class="text-left">Last Updated</th>
            <!-- <th></th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(invoice, i) in invoices" :key="i" @click="() => $router.push(`/invoices/${invoice.id}/edit`)">
            <td>{{ i }}</td>
            <td>{{ invoice.title }}</td>
            <td>{{ invoice.netAmount }} {{ invoice.paymentToken.symbol }}</td>
            <td>{{ invoice.client.name }}</td>
            <td>{{ utils.formatDate(invoice.updatedAt) }}</td>
            <!-- <td>
              <v-btn variant="text" color="primary" density="compact" :to="`/invoices/${invoice.id}`">
                view invoice
              </v-btn>
            </td> -->
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script>
import { storeToRefs } from "pinia"
import { onMounted } from "vue"
import { invoiceService } from "../../services"
import { useInvoiceStore } from "../../stores"
import { utils } from "../../utils"

export default {
  setup() {
    const { invoices } = storeToRefs(useInvoiceStore())

    onMounted(async () => {
      await invoiceService.loadInvoices({ status: "DRAFT" })
    })

    return { invoices, utils }
  },
}
</script>
