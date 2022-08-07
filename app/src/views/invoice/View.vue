<template>
  <v-row>
    <v-col cols="12" md="8" offset-md="2">
      <v-card>
        <v-card-text class="px-5 py-10">
          <div class="mb-5 d-md-flex justify-md-space-between">
            <p class="h5 mb-3">{{ invoice.title }}</p>

            <div class="mb-3">
              <p class="h6">{{ invoice.client.name }}</p>
              <p class="text-small" v-if="invoice.client.line1">{{ invoice.client.line1 }}</p>
              <p class="text-small">
                <span v-if="invoice.client.city">{{ invoice.client.city }}, </span>
                <span v-if="invoice.client.invoice">{{ invoice.client.invoice }}, </span>
                <span v-if="invoice.client.postalCode">{{ invoice.client.postalCode }}</span>
              </p>
              <p class="text-small" v-if="invoice.client.country">{{ invoice.client.country }}</p>
              <p class="text-small" v-if="invoice.client.taxNumber">Tax Number: {{ invoice.client.taxNumber }}</p>
            </div>
          </div>

          <v-divider />

          <v-row class="my-3">
            <v-col cols="12" md="6">
              <h5 class="h6 secondary-text text-uppercase mb-1">Bill To:</h5>
              <div>
                <p class="h6 mb-1">{{ invoice.client.name }}</p>
                <p class="text-small" v-if="invoice.client.line1">{{ invoice.client.line1 }}</p>
                <p class="text-small">
                  <span v-if="invoice.client.city">{{ invoice.client.city }}, </span>
                  <span v-if="invoice.client.invoice">{{ invoice.client.invoice }}, </span>
                  <span v-if="invoice.client.postalCode">{{ invoice.client.postalCode }}</span>
                </p>
                <p class="text-small" v-if="invoice.client.country">{{ invoice.client.country }}</p>
                <p class="text-small" v-if="invoice.client.taxNumber">Tax Number: {{ invoice.client.taxNumber }}</p>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="d-md-flex">
                <v-spacer class="d-none d-md-block" />

                <div class="">
                  <p class="mb-1">Invoice Number: {{ invoice.number }}</p>
                  <p class="mb-1">Issue Date: {{ utils.formatDate(invoice.issuedAt) }}</p>
                  <p>Due Date: {{ utils.formatDate(invoice.dueAt) }}</p>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row class="mt-3">
            <v-col cols="12">
              <v-table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Tax (%)</th>
                    <th>Discount (%)</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, i) in invoice.items">
                    <tr v-if="item.mode != 'delete'" :key="i">
                      <td style="width: 40%">
                        {{ item.description }}
                      </td>
                      <td style="width: 15%">
                        {{ item.quantity }}
                      </td>
                      <td style="width: 15%">
                        {{ item.price }}
                        {{ invoice.paymentToken.symbol }}
                      </td>
                      <td style="width: 10%">
                        {{ item.tax || 0 }}
                      </td>
                      <td style="width: 10%">
                        {{ item.discount || 0 }}
                      </td>
                      <td style="width: 9%">
                        {{ item.netAmount }}
                        {{ invoice.paymentToken.symbol }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </v-table>
            </v-col>
          </v-row>

          <v-row class="mt-10">
            <v-col offset-md="6" md="6" cols="12">
              <ul class="list-unstyled">
                <li class="d-flex justify-space-between">
                  <span>Total tax</span>
                  <span>
                    {{ invoice.totalTaxAmount }}
                    {{ invoice.paymentToken.symbol }}
                  </span>
                </li>
                <v-divider class="my-3" />
                <li class="d-flex justify-space-between">
                  <span>Total amount without tax</span>
                  <span>
                    {{ invoice.amountWithoutTax }}
                    {{ invoice.paymentToken.symbol }}
                  </span>
                </li>
                <v-divider class="my-3" />
                <li class="d-flex justify-space-between">
                  <span>Total amount</span>
                  <span>
                    {{ invoice.netAmount }}
                    {{ invoice.paymentToken.symbol }}
                  </span>
                </li>
              </ul>
            </v-col>
          </v-row>

          <v-row class="mt-5">
            <v-col cols="12" md="6">
              <p v-if="invoice.notes">{{ invoice.notes }}</p>
              <p v-else class="secondary-text">This invoice has no notes</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div class="d-flex mt-5">
        <v-spacer />

        <div class="">
          <v-btn flat color="primary" class="me-3">Accept Invoice</v-btn>
          <v-btn flat variant="tonal" color="seconadry">Reject Invoice</v-btn>
        </div>
      </div>
    </v-col>

    <!-- <v-col md="4">
      <div class="text-center mb-5">
        <p class="">You are about to pay an invoice of</p>
        <p class="h4 text-center">{{ invoice.netAmount }} {{ invoice.paymentToken.symbol }}</p>
      </div>

      <v-btn flat block color="primary"> Pay Now </v-btn>
    </v-col> -->
  </v-row>
</template>

<script>
import { onMounted } from "vue"
import { storeToRefs } from "pinia"
import { useRoute } from "vue-router"
import { useInvoiceStore } from "../../stores"
import { invoiceService } from "../../services"
import { toast, utils, web3 } from "../../utils"

export default {
  setup() {
    const route = useRoute()
    const { invoice } = storeToRefs(useInvoiceStore())

    onMounted(async () => {
      try {
        await invoiceService.loadInvoice(route.params.id)
      } catch (e) {
        toast.error(e.message)
      }
    })

    return { invoice, utils, web3 }
  },
}
</script>

<style scoped>
thead {
  background: rgb(var(--v-theme-primary));
  color: #fff;
}
</style>
