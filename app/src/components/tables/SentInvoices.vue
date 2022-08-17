<template>
  <v-table class="mt-3">
    <thead>
      <tr>
        <th>Invoice Number</th>
        <th>Title</th>
        <th>Amount</th>
        <th>Client</th>
        <th>Issue Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(invoice, i) in invoices" :key="i" @click="() => $router.push(`/invoices/${invoice.id}`)">
        <td>{{ invoice.number }}</td>
        <td>{{ invoice.title }}</td>
        <td>{{ invoice.netAmount }} {{ invoice.paymentToken.symbol }}</td>
        <td>{{ invoice.client.name }}</td>
        <td>{{ utils.formatDate(invoice.issuedAt) }}</td>
        <td>
          <v-chip
            label
            density="comfortable"
            :color="
              invoice.status === 'PENDING'
                ? 'warning'
                : invoice.status === 'APPROVED'
                ? 'info'
                : invoice.status === 'REJECTED'
                ? 'error'
                : 'success'
            "
          >
            {{ invoice.status }}
          </v-chip>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { utils } from "../../utils";

export default {
  props: ["invoices"],
  setup() {
    return { utils };
  },
};
</script>
