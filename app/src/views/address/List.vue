<template>
  <v-row>
    <v-col cols="12" md="10" class="mx-auto">
      <div class="d-flex mb-5">
        <h5 class="h5">Address List</h5>
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

      <Loader v-if="state.loading" />

      <template v-else>
        <v-list v-if="addresses.length > 0" lines="two">
          <template v-for="(address, i) in addresses" :key="i">
            <v-list-item class="mb-3" border link :to="`/addresses/${address.id}`">
              <v-list-item-title class="mb-2">{{ address.label }}</v-list-item-title>
              <v-list-item-subtitle>{{ address.address }}</v-list-item-subtitle>
              <template v-slot:append>
                <!-- <v-list-item-action>
            <v-btn
              flat
              variant="text"
              color="info"
              size="small"
              icon="mdi-pencil-outline"
              @click="toggleModal('edit', { current: address })"
            />
          </v-list-item-action> -->
                <v-list-item-action>
                  <v-btn flat variant="text" color="info" size="small" icon="mdi-arrow-right" />
                </v-list-item-action>
              </template>
            </v-list-item>
          </template>
        </v-list>

        <Empty v-else message="No address has been added yet" />
      </template>
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
import NewAddress from "../../components/modals/address/New.vue"
import EditAddress from "../../components/modals/address/Edit.vue"
import { storeToRefs } from "pinia"
import { useAddressStore } from "../../stores"
import { addressService } from "../../services"
import { toast } from "../../utils"
import Loader from "../../components/Loader.vue"
import Empty from "../../components/Empty.vue"

export default {
  components: { NewAddress, EditAddress, Loader, Empty },

  setup() {
    const { addresses } = storeToRefs(useAddressStore())
    const state = reactive({
      loading: false,
      modals: { new: null, edit: null },
      current: {},
    })

    function toggleModal(p, data = {}) {
      for (const key in data) {
        state[key] = data[key]
      }

      state.modals[p] = !state.modals[p]
    }

    onMounted(async () => {
      try {
        state.loading = true
        await addressService.loadAddresses()
      } catch (e) {
        toast.error(e.message)
      } finally {
        state.loading = false
      }
    })

    return { state, toggleModal, addresses }
  },
}
</script>
