<template>
  <div class="d-flex mb-5">
    <h5 class="h5">Clients</h5>
    <v-spacer />
    <v-btn flat variant="text" density="compact" color="primary" @click.stop="toggleModal('new')">Add a client</v-btn>
  </div>

  <v-text-field
    variant="outlined"
    color="primary"
    density="compact"
    prepend-inner-icon="mdi-magnify"
    placeholder="Search clients..."
  />

  <v-row>
    <v-col>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Email Address</th>
            <th class="text-left">Tax Number</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(client, i) in clients" :key="i">
            <td>{{ client.name }}</td>
            <td>{{ client.email || "N/A" }}</td>
            <td>{{ client.taxNumber || "N/A" }}</td>
            <td>
              <v-btn variant="text" color="primary" density="compact" :to="`/clients/${client.id}`">view client</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
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

export default {
  components: { NewClient },
  setup() {
    const { clients } = storeToRefs(useClientStore())
    const state = reactive({ modals: { new: null } })

    function toggleModal(p) {
      state.modals[p] = !state.modals[p]
    }

    onMounted(async () => {
      try {
        await clientService.loadClients()
      } catch (e) {
        toast.error(e.message)
      }
    })

    return { state, clients, toggleModal }
  },
}
</script>
