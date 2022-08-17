<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Invoice Number</th>
        <th class="text-left">Title</th>
        <th class="text-left">Amount</th>
        <th class="text-left">Client</th>
        <th class="text-left">Last Updated</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(invoice, i) in invoices" :key="i" @click="() => $router.push(`/invoices/${invoice.id}/edit`)">
        <td>{{ invoice.number }}</td>
        <td>{{ invoice.title }}</td>
        <td>{{ invoice.netAmount }} {{ invoice.paymentToken.symbol }}</td>
        <td>{{ invoice.client.name }}</td>
        <td>{{ utils.formatDate(invoice.updatedAt) }}</td>
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
