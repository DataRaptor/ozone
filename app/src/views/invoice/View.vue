<template>
  <v-row>
    <Loader v-if="state.loading" />
    <v-col v-else cols="12" md="8" offset-md="2">
      <div class="d-flex my-3">
        <template v-if="$route.query.token">
          <template v-if="invoice.status !== 'DRAFT'">
            <div v-if="invoice.status === 'PENDING'">
              <v-btn flat color="primary" class="me-3" @click="updateInvoiceStatus('APPROVED')">Approve Invoice</v-btn>
              <v-btn flat variant="tonal" @click="updateInvoiceStatus('REJECTED')">Reject Invoice</v-btn>
            </div>
            <div v-else>
              <v-chip label color="error" v-if="invoice.status == 'REJECTED'">{{ invoice.status }}</v-chip>
              <v-chip label color="success" v-else-if="invoice.status == 'PAID'">{{ invoice.status }}</v-chip>
              <v-btn v-else flat variant="tonal" color="primary" @click="makePayment">Pay Now</v-btn>
            </div>
          </template>
        </template>

        <v-spacer />

        <v-btn flat variant="tonal" prepend-icon="mdi-chevron-down">
          More Actions

          <v-menu activator="parent" location="bottom">
            <v-list nav density="compact">
              <template v-for="(action, i) in state.actions" :key="i">
                <v-divider
                  class="my-2"
                  v-if="action.divider && (action.ensureCompany ? company.id === invoice.company.id : true)"
                />

                <template v-else>
                  <v-list-item
                    v-if="action.ensureCompany ? company.id === invoice.company.id : true"
                    :value="i"
                    :prepend-icon="action.icon"
                    :title="action.title"
                    :to="action.to"
                    @click="action.function"
                  />
                </template>
              </template>
            </v-list>
          </v-menu>
        </v-btn>
      </div>

      <v-card id="invoice">
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
    </v-col>
  </v-row>

  <PayModal
    :payment="state.payment"
    :symbol="invoice.paymentToken.symbol"
    :show="state.modals.pay"
    @toggle-modal="toggleModal('pay')"
    :completed="state.completed"
  />
</template>

<script>
import { onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import html2pdf from "html2pdf.js";
import { useRoute } from "vue-router";
import { useCompanyStore, useInvoiceStore } from "../../stores";
import { invoiceService, paymentService } from "../../services";
import { solanapay, toast, utils, web3 } from "../../utils";
import Loader from "../../components/Loader.vue";
import PayModal from "../../components/modals/Pay.vue";

export default {
  components: { Loader, PayModal },
  setup() {
    const route = useRoute();
    const { invoice } = storeToRefs(useInvoiceStore());
    const { company } = storeToRefs(useCompanyStore());

    const state = reactive({
      loading: true,
      payment: {},
      modals: { pay: null },
      actions: [
        { title: "Download", icon: "mdi-download-outline", function: downloadInvoice },
        { title: "Copy Link", icon: "mdi-content-copy", function: copyInvoiceLink },
        { title: "Send Reminder", icon: "mdi-clock-alert-outline", function: sendReminder, ensureCompany: true },
        { divider: true, ensureCompany: true },
        { title: "Edit", icon: "mdi-pencil-outline", to: `/invoices/${route.params.id}/edit`, ensureCompany: true },
        { title: "Delete", icon: "mdi-delete-outline", ensureCompany: true },
      ],
    });

    onMounted(async () => {
      try {
        state.loading = true;
        await invoiceService.loadInvoice(route.params.id);
      } catch (e) {
        toast.error(e.message);
      } finally {
        state.loading = false;
      }
    });

    function toggleModal(p) {
      state.modals[p] = !state.modals[p];
    }

    function downloadInvoice() {
      const element = document.querySelector("#invoice");
      const pdf = html2pdf().from(element);

      pdf.saveAs(invoice.value.title);
    }

    async function copyInvoiceLink() {
      const data = await invoiceService.getShareToken(route.params.id);

      console.log(data);
      console.log(`https://ozonefinance.co/invoices/${route.params.id}?bar=0&token=${data.token}`);
    }

    async function updateInvoiceStatus(status) {
      await invoiceService.updateInvoiceStatus(route.params.id, { status, token: route.query.token });
    }

    async function makePayment() {
      const token = invoice.value.paymentToken;
      const address = invoice.value.paymentAddress;
      const company = invoice.value.company;
      const client = invoice.value.client;

      const initData = {
        source: "INVOICE",
        tokenId: token.id,
        addressId: address.id,
        companyId: company.id,
        clientId: client.id,
        invoiceId: invoice.value.id,
        amount: invoice.value.netAmount,
      };

      const payment = await paymentService.initiatePayment(initData);
      const amount = payment.amount / Math.pow(10, payment.token.decimals);

      state.payment = {
        amount,
        label: invoice.value.company.name,
        reference: payment.reference,
        token: payment.token.address,
        recipient: payment.address.address,
        message: `Invoice payment of ${amount} ${payment.token.symbol}`,
      };

      solanapay.waitForPayment(
        { reference: payment.reference, recipient: address.address, splToken: token.address, amount },
        async (signature) => {
          await invoiceService.completeInvoicePayment(invoice.value.id, {
            transactionId: signature,
            token: route.query.token,
          });

          state.completed = true;
        }
      );

      toggleModal("pay");
    }

    async function sendReminder() {
      await invoiceService.sendInvoiceReminder(invoice.value.id);
    }

    return { state, invoice, utils, web3, company, makePayment, toggleModal, updateInvoiceStatus };
  },
};
</script>

<style scoped>
thead {
  background: rgb(var(--v-theme-primary));
  color: #fff;
}
</style>
