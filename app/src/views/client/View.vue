<template>
  <div class="d-flex mb-5">
    <h4 class="h4">{{ client.name }}</h4>
  </div>
  <v-row>
    <v-col cols="12" md="6">
      <div class="d-flex">
        <p class="h5 mb-3">Client Details</p>
        <v-spacer />
        <v-btn flat variant="text" class="px-0" density="compact" color="primary" @click="toggleModal('edit')">
          <v-icon icon="mdi-pencil-outline" />
          Edit
        </v-btn>
      </div>

      <ul class="list-unstyled">
        <li class="my-2 d-flex justify-space-between">
          <span>Email</span>
          <span>{{ client.email || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Phone Number</span>
          <span>{{ client.phone || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Address</span>
          <span>{{ client.line1 || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>City</span>
          <span>{{ client.city || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>State</span>
          <span>{{ client.state || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Postal Code</span>
          <span>{{ client.postalCode || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Country</span>
          <span>{{ client.country || "N/A" }}</span>
        </li>
        <v-divider class="my-3" />
        <li class="my-2 d-flex justify-space-between">
          <span>Tax Number</span>
          <span>{{ client.taxNumber || "N/A" }}</span>
        </li>
      </ul>
    </v-col>
  </v-row>

  <EditClient :show="state.modals.edit" @toggle-modal="toggleModal('edit')" :client="client" />
</template>

<style scoped>
.list-unstyled {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>

<script>
import { onMounted, reactive } from "vue"
import { useClientStore } from "../../stores"
import { clientService } from "../../services"
import { storeToRefs } from "pinia"
import { useRoute } from "vue-router"
import EditClient from "../../components/modals/client/Edit.vue"
import { toast } from "../../utils"

export default {
  components: { EditClient },
  setup() {
    const route = useRoute()
    const { client } = storeToRefs(useClientStore())
    const state = reactive({ modals: { edit: null } })

    function toggleModal(p) {
      state.modals[p] = !state.modals[p]
    }

    onMounted(async () => {
      try {
        await clientService.loadClient(route.params.id)
      } catch (e) {
        toast.error(e.message)
      }
    })

    return { state, client, toggleModal }
  },
}
</script>
