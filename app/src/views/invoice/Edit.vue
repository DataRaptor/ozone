<template>
  <h5 class="h5 mb-5">Edit invoice</h5>

  <Loader v-if="state.loading" />
  <v-card v-else flat>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-text-field
          v-model="invoice.title"
          type="text"
          placeholder="Invoice 001"
          density="compact"
          color="primary"
          variant="plain"
        />
      </v-col>

      <v-col cols="12" md="6" class="pt-0">
        <div class="d-flex">
          <h5 class="h5">Your Company Details</h5>
          <v-btn
            density="compact"
            variant="text"
            icon="mdi-pencil-outline"
            class="ms-3"
            size="small"
            @click="toggleModal('editCompany')"
          />
        </div>

        <div>
          <p class="h6" v-if="state.company.name">{{ state.company.name }}</p>

          <div class="my-2">
            <p class="text-small" v-if="state.company.line1">{{ state.company.line1 }}</p>
            <p class="text-small">
              <span v-if="state.company.city">{{ state.company.city }}, </span>
              <span v-if="state.company.state">{{ state.company.state }}, </span>
              <span v-if="state.company.postalCode">{{ state.company.postalCode }}</span>
            </p>
            <p class="text-small" v-if="state.company.country">{{ state.company.country }}</p>
          </div>

          <p class="text-small" v-if="state.company.taxNumber">Tax Number: {{ state.company.taxNumber }}</p>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-5" />
    <h5 class="h5">Billing Details</h5>

    <v-row class="mt-3">
      <v-col md="6" cols="12">
        <v-row>
          <v-col class="pb-0" cols="12">
            <div class="mb-3 d-flex">
              <v-label>Your Client</v-label>
              <v-spacer />
              <v-btn
                color="primary"
                density="compact"
                variant="text"
                prepend-icon="mdi-plus"
                @click="toggleModal('newClient')"
              >
                Add client
              </v-btn>
            </div>

            <v-select
              type="select"
              :items="state.clients"
              item-title="name"
              item-value="id"
              density="compact"
              color="primary"
              variant="outlined"
              return-object
              v-model="invoice.client.id"
            />

            <div class="mt-0 mb-3" v-if="invoice.client.id">
              <div class="d-flex">
                <p class="h6 font-weight-bold" v-if="invoice.client.name">{{ invoice.client.name }}</p>
                <v-btn
                  density="compact"
                  variant="text"
                  icon="mdi-pencil-outline"
                  class="ms-3"
                  size="small"
                  @click="toggleModal('editClient')"
                />
              </div>

              <div class="my-2">
                <p class="text-small" v-if="invoice.client.line1">{{ invoice.client.line1 }}</p>
                <p class="text-small">
                  <span v-if="invoice.client.city">{{ invoice.client.city }}, </span>
                  <span v-if="invoice.client.state">{{ invoice.client.state }}, </span>
                  <span v-if="invoice.client.postalCode">{{ invoice.client.postalCode }}</span>
                </p>
                <p class="text-small" v-if="invoice.client.country">{{ invoice.client.country }}</p>
              </div>

              <p class="text-small" v-if="invoice.client.taxNumber">Tax Number: {{ invoice.client.taxNumber }}</p>
            </div>
            <div class="text-center d-none d-md-block" v-else>
              <p class="secondary-text">No client selected</p>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="6" cols="12">
        <v-row>
          <v-col class="pb-0" cols="12">
            <v-label class="mb-3">Invoice Number</v-label>
            <v-text-field
              v-model="invoice.number"
              type="text"
              placeholder="Invoice Number"
              density="compact"
              color="primary"
              variant="outlined"
            />
          </v-col>

          <v-col class="py-0" md="6" cols="12">
            <v-label class="mb-3">Issue Date</v-label>
            <v-text-field
              v-model="invoice.issuedAt"
              type="date"
              placeholder="Issue Date"
              density="compact"
              color="primary"
              variant="outlined"
            />
          </v-col>

          <v-col class="py-0" md="6" cols="12">
            <v-label class="mb-3">Due Date</v-label>
            <v-text-field
              v-model="invoice.dueAt"
              type="date"
              placeholder="Invoice TItle"
              density="compact"
              color="primary"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-divider class="my-5" />
    <h5 class="h5">Payment Details</h5>

    <v-row class="mt-3">
      <v-col cols="12" md="6" class="pb-0">
        <v-label class="mb-3">What token do you want to be paid in?</v-label>
        <v-select
          :items="state.tokens"
          v-model="invoice.paymentToken.id"
          item-title="name"
          item-value="id"
          type="select"
          density="compact"
          color="primary"
          variant="outlined"
          return-object
        >
          <template v-slot:append-inner>
            <v-avatar size="25">
              <v-img :src="invoice.paymentToken && invoice.paymentToken.logo" />
            </v-avatar>
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" md="6">
        <div class="mb-2 d-flex">
          <v-label>Payment address</v-label>
          <v-spacer />
          <v-btn
            color="primary"
            density="compact"
            variant="text"
            prepend-icon="mdi-plus"
            @click="toggleModal('newAddress')"
          >
            Add address
          </v-btn>
        </div>

        <v-select
          type="select"
          :items="state.addresses"
          v-model="invoice.paymentAddress.id"
          item-title="label"
          item-value="id"
          density="compact"
          color="primary"
          variant="outlined"
          return-object
        />
      </v-col>
    </v-row>

    <v-divider class="my-5" />

    <v-row>
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
                  <v-text-field
                    v-model="item.description"
                    class="mt-5"
                    type="text"
                    density="compact"
                    color="primary"
                    variant="outlined"
                    placeholder="Item description"
                  />
                </td>
                <td style="width: 15%">
                  <v-text-field
                    v-model.number="item.quantity"
                    @input="updateItem(item)"
                    class="mt-5"
                    type="number"
                    density="compact"
                    color="primary"
                    variant="outlined"
                    placeholder="Quantity"
                  />
                </td>
                <td style="width: 15%">
                  <v-text-field
                    v-model.number="item.price"
                    @input="updateItem(item)"
                    class="mt-5"
                    type="number"
                    density="compact"
                    color="primary"
                    variant="outlined"
                    placeholder="Unit price"
                  />
                </td>
                <td style="width: 10%">
                  <v-text-field
                    v-model.number="item.tax"
                    @input="updateItem(item)"
                    class="mt-5"
                    type="number"
                    density="compact"
                    color="primary"
                    variant="outlined"
                  />
                </td>
                <td style="width: 10%">
                  <v-text-field
                    v-model.number="item.discount"
                    @input="updateItem(item)"
                    class="mt-5"
                    type="number"
                    density="compact"
                    color="primary"
                    variant="outlined"
                  />
                </td>
                <td style="width: 9%">
                  {{ item.netAmount }} {{ invoice.paymentToken && invoice.paymentToken.symbol }}
                </td>
                <td style="width: 1%">
                  <v-btn
                    flat
                    size="small"
                    density="compact"
                    icon="mdi-delete-outline"
                    @click="deleteInvoiceItem(item, i)"
                  />
                </td>
              </tr>
            </template>
          </tbody>
        </v-table>

        <div class="d-flex mt-5">
          <v-btn flat variant="text" density="compact" color="primary" @click="addInvoiceItem">Add an Item</v-btn>
          <v-spacer />
        </div>

        <v-row class="mt-3">
          <v-col offset-md="8" md="4" cols="12">
            <ul class="list-unstyled">
              <li class="d-flex justify-space-between">
                <span>Total tax</span>
                <span> {{ invoice.totalTaxAmount }} {{ invoice.paymentToken && invoice.paymentToken.symbol }}</span>
              </li>
              <v-divider class="my-3" />
              <li class="d-flex justify-space-between">
                <span>Total amount without tax</span>
                <span> {{ invoice.amountWithoutTax }} {{ invoice.paymentToken && invoice.paymentToken.symbol }}</span>
              </li>
              <v-divider class="my-3" />
              <li class="d-flex justify-space-between">
                <span>Total amount</span>
                <span> {{ invoice.netAmount }} {{ invoice.paymentToken && invoice.paymentToken.symbol }}</span>
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-textarea v-model="invoice.notes" placeholder="Add some notes" variant="plain" />
      </v-col>

      <div class="d-flex mb-10 ms-3">
        <v-spacer />
        <v-btn flat color="primary" class="me-3" @click="saveInvoice('DRAFT')">Save as draft</v-btn>
        <v-btn flat color="primary" @click="saveInvoice()">Create and send</v-btn>
      </div>
    </v-row>
  </v-card>

  <EditClient
    :show="state.modals.editClient"
    @toggle-modal="toggleModal('editClient')"
    :client="state.selectedClient"
  />
  <NewClient :show="state.modals.newClient" @toggle-modal="toggleModal('newClient')" />
  <NewAddress :show="state.modals.newAddress" @toggle-modal="toggleModal('newAddress')" />
  <EditCompany :show="state.modals.editCompany" @toggle-modal="toggleModal('editCompany')" />
</template>

<script>
import { reactive, onMounted } from "vue"
import EditClient from "../../components/modals/client/Edit.vue"
import NewClient from "../../components/modals/client/New.vue"
import NewAddress from "../../components/modals/address/New.vue"
import EditCompany from "../../components/modals/company/Edit.vue"
import { useAddressStore, useClientStore, useCompanyStore, useInvoiceStore, useTokenStore } from "../../stores"
import { storeToRefs } from "pinia"
import { addressService, clientService, invoiceService, tokenService } from "../../services"
import { tally, toast, utils } from "../../utils"
import { useRoute } from "vue-router"
import Loader from "../../components/Loader.vue"

export default {
  components: { EditClient, NewClient, NewAddress, EditCompany, Loader },
  setup() {
    const { clients } = storeToRefs(useClientStore())
    const { company } = storeToRefs(useCompanyStore())
    const { addresses } = storeToRefs(useAddressStore())
    const { tokens } = storeToRefs(useTokenStore())
    const { invoice } = storeToRefs(useInvoiceStore())

    const itemsBlueprint = {
      tax: "",
      netAmount: 0,
      price: "",
      discount: "",
      quantity: "",
      mode: "create",
      description: "",
    }

    const route = useRoute()
    const state = reactive({
      loading: false,
      modals: {
        editClient: null,
        newClient: null,
        newAddress: null,
        editCompany: null,
      },
      company,
      clients,
      addresses,
      tokens,
      selectedClient: null,
      paymentAddress: null,
      paymentToken: null,
      netAmount: 0,
      amountWithoutTax: 0,
      totalTaxAmount: 0,
    })

    function toggleModal(p) {
      state.modals[p] = !state.modals[p]
    }

    function addInvoiceItem() {
      invoice.value.items.push({ ...itemsBlueprint })
    }

    function updateItem(item) {
      const itemAmount = tally.getItemAmounts(item)

      item.taxAmount = itemAmount.taxAmount
      item.amountWithoutTax = itemAmount.amountWithoutTax
      item.netAmount = itemAmount.netAmount

      const stateAmount = tally.sumTotalAmounts(invoice.value.items)

      invoice.value.netAmount = stateAmount.netAmount
      invoice.value.amountWithoutTax = stateAmount.amountWithoutTax
      invoice.value.totalTaxAmount = stateAmount.totalTaxAmount
    }

    function deleteInvoiceItem(item) {
      const netAmount = isNaN(Number(item.netAmount)) ? 0 : Number(item.netAmount)
      const amountWithoutTax = isNaN(Number(item.amountWithoutTax)) ? 0 : Number(item.amountWithoutTax)
      const taxAmount = isNaN(Number(item.taxAmount)) ? 0 : Number(item.taxAmount)

      invoice.value.netAmount = isNaN(Number(invoice.value.netAmount)) ? 0 : Number(invoice.value.netAmount) - netAmount
      invoice.value.amountWithoutTax = isNaN(Number(invoice.value.amountWithoutTax))
        ? 0
        : Number(invoice.value.amountWithoutTax) - amountWithoutTax
      invoice.value.totalTaxAmount = isNaN(Number(invoice.value.totalTaxAmount))
        ? 0
        : Number(invoice.value.totalTaxAmount) - taxAmount

      item.mode = "delete"
    }

    async function saveInvoice(status) {
      try {
        const payload = {
          status,
          items: [],
          notes: invoice.value.notes,
          title: invoice.value.title,
          number: invoice.value.number,
          clientId: invoice.value.client?.id,
          dueAt: new Date(invoice.value.dueAt).getTime(),
          paymentTokenId: invoice.value.paymentToken?.id,
          paymentAddressId: invoice.value.paymentAddress?.id,
          issuedAt: new Date(invoice.value.issuedAt).getTime(),
        }

        invoice.value.items.forEach((item) => {
          payload.items.push({
            id: item.id,
            tax: item.tax,
            mode: item.mode,
            price: item.price,
            quantity: item.quantity,
            discount: item.discount,
            companyId: state.company.id,
            description: item.description,
            mode: !!item.id && !item.mode ? "update" : item.mode,
          })
        })

        await invoiceService.updateInvoice(invoice.value.id, payload)
      } catch (e) {
        toast.error(e.message)
      }
    }

    onMounted(async () => {
      try {
        state.loading = true

        await Promise.all([
          invoiceService.loadInvoice(route.params.id),
          clientService.loadClients(),
          addressService.loadAddresses(),
          tokenService.loadTokens(),
        ])
      } catch (e) {
        toast.error(e.message)
      } finally {
        state.loading = false
      }
    })

    return {
      state,
      invoice,
      addInvoiceItem,
      saveInvoice,
      toggleModal,
      updateItem,
      deleteInvoiceItem,
    }
  },
}
</script>

<style scoped>
.list-unstyled {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
