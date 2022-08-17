<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Transaction ID</th>
        <th class="text-left">Amount</th>
        <th class="text-left" v-if="all">Source</th>
        <th class="text-left">Client</th>
        <th class="text-left">Status</th>
        <th class="text-left">Date</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(payment, i) in payments" :key="i">
        <td>
          <v-btn
            link
            target="_blank"
            :href="`${config.solana.explorerUrl}/tx/${payment.transactionId}?cluster=${config.solana.env}`"
            v-if="payment.transactionId"
            class="pa-0"
            variant="text"
            density="compact"
            color="primary"
          >
            {{ utils.truncateAddress(payment.transactionId) }}
          </v-btn>
          <span v-else>N/A</span>
        </td>
        <td>{{ payment.amount / Math.pow(10, payment.token.decimals) }} {{ payment.token.symbol }}</td>
        <td v-if="all">
          <v-chip
            label
            :color="payment.source === 'INVOICE' ? 'primary' : payment.source === 'POS' ? 'success' : 'info'"
            density="compact"
          >
            {{ payment.source }}
          </v-chip>
        </td>
        <td>{{ (payment.client && payment.client.name) || "N/A" }}</td>
        <td>
          <v-chip label :color="payment.status === 'COMPLETED' ? 'success' : 'warning'" density="compact">
            {{ payment.status }}
          </v-chip>
        </td>
        <td>{{ utils.formatDate(payment.createdAt, "MMM dd, yyyy hh:mm aa") }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { config } from "../../config";
import { utils } from "../../utils";

export default {
  props: ["payments", "all"],
  setup() {
    return { utils, config };
  },
};
</script>
