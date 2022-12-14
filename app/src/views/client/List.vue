<template>
  <v-row>
    <v-col cols="12" md="10" class="mx-auto">
      <div class="d-flex mb-5">
        <h5 class="h5">Clients</h5>
        <v-spacer />
        <v-btn flat variant="text" density="compact" color="primary" @click.stop="toggleModal('new')">
          Add a client
        </v-btn>
      </div>

      <v-text-field
        variant="outlined"
        color="primary"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search clients..."
      />

      <Loader v-if="state.loading" />
      <v-table v-else>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Tax Number</th>
          </tr>
        </thead>
        <tbody v-if="clients.length > 0">
          <tr v-for="(client, i) in clients" :key="i" @click="() => $router.push(`/clients/${client.id}`)">
            <td>{{ client.name }}</td>
            <td>{{ client.email || "N/A" }}</td>
            <td>{{ client.phone || "N/A" }}</td>
            <td>{{ client.taxNumber || "N/A" }}</td>
          </tr>
        </tbody>
      </v-table>

      <Empty v-if="clients.length < 1" message="No client has been added yet" />
    </v-col>
  </v-row>

  <NewClient :show="state.modals.new" @toggle-modal="toggleModal('new')" />
</template>

<script>
import NewClient from "../../components/modals/client/New.vue"
import { onMounted, reactive } from "vue"
import { useClientStore } from "../../stores"
import { clientService } from "../../services"
import { storeToRefs } from "pinia"
import { toast } from "../../utils"
import Loader from "../../components/Loader.vue"
import Empty from "../../components/Empty.vue"

export default {
  components: { NewClient, Loader, Empty },
  setup() {
    const { clients } = storeToRefs(useClientStore())
    const state = reactive({ loading: false, modals: { new: null } })

    function toggleModal(p) {
      state.modals[p] = !state.modals[p]
    }

    onMounted(async () => {
      try {
        state.loading = true
        await clientService.loadClients()
      } catch (e) {
        toast.error(e.message)
      } finally {
        state.loading = false
      }
    })

    return { state, clients, toggleModal }
  },
}
</script>
