<template>
  <v-table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Amount</th>
        <th>Redirect URL</th>
        <th>Creation Date</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(paymentLink, i) in paymentLinks" :key="i">
        <td>{{ paymentLink.title }}</td>
        <td>
          {{
            paymentLink.amount && paymentLink.amount !== "0"
              ? `${paymentLink.amount / Math.pow(10, paymentLink.token.decimals)} ${paymentLink.token.symbol}`
              : "N/A"
          }}
        </td>
        <td>{{ paymentLink.redirectUrl || "N/A" }}</td>
        <td>{{ utils.formatDate(paymentLink.createdAt, "MMM dd, yyyy hh:mm aa") }}</td>
        <td>
          <v-btn
            density="compact"
            class="mr-3"
            variant="icon"
            size="small"
            icon="mdi-content-copy"
            @click="copyLink(paymentLink.id)"
          />
          <v-btn density="compact" class="mr-3" variant="icon" size="small" color="primary" icon="mdi-pencil-outline" />
          <v-btn density="compact" class="mr-3" variant="icon" size="small" color="error" icon="mdi-delete-outline" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { toast, utils } from "../../utils";

export default {
  props: ["paymentLinks"],
  setup() {
    async function copyLink(id) {
      try {
        const link = `${window.location.origin}/pay/${id}`;
        await utils.copyToClipBoard(link);

        toast.success("Link has been copied");
      } catch (e) {
        console.log(e);
      }
    }

    return { utils, copyLink };
  },
};
</script>
