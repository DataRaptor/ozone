<template>
  <div class="d-flex mb-5">
    <h5 class="h5">Addresses</h5>
    <v-spacer />
    <v-btn flat variant="text" density="compact" color="primary" @click="toggleModal('new')">Add an address</v-btn>
  </div>

  <v-text-field
    variant="outlined"
    color="primary"
    density="compact"
    prepend-inner-icon="mdi-magnify"
    placeholder="Search Addresses..."
  />

  <v-row>
    <v-col>
      <v-list lines="two">
        <template v-for="(address, i) in addresses" :key="i">
          <v-list-item link>
            <v-list-item-title class="mb-2">{{ address.label }}</v-list-item-title>
            <v-list-item-subtitle>{{ address.address }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-list-item-action>
                <v-btn
                  flat
                  variant="text"
                  color="info"
                  size="small"
                  icon="mdi-pencil-outline"
                  @click="toggleModal('edit', { current: address })"
                />
              </v-list-item-action>
              <v-list-item-action>
                <v-btn flat variant="text" color="error" size="small" icon="mdi-delete-outline" />
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider class="py-0 my-0" />
        </template>
      </v-list>
    </v-col>
  </v-row>
  <NewAddress :show="state.modals.new" @toggle-modal="toggleModal('new')" />
  <EditAddress
    :show="state.modals.edit"
    @toggle-modal="toggleModal('edit', { current: {} })"
    :address="state.current"
  />
</template>

<script>
import { onMounted, reactive } from "vue"
import NewAddress from "../components/modals/address/New.vue"
import EditAddress from "../components/modals/address/Edit.vue"
import { storeToRefs } from "pinia"
import { useAddressStore } from "../stores"
import { addressService } from "../services"
import { toast } from "../utils"

export default {
  components: { NewAddress, EditAddress },

  setup() {
    const { addresses } = storeToRefs(useAddressStore())
    const state = reactive({ modals: { new: null, edit: null }, current: {} })

    function toggleModal(p, data = {}) {
      for (const key in data) {
        state[key] = data[key]
      }

      state.modals[p] = !state.modals[p]
    }

    onMounted(async () => {
      try {
        await addressService.loadAddresses()
      } catch (e) {
        toast.error(e.message)
      }
    })

    return { state, toggleModal, addresses }
  },
}
</script>
