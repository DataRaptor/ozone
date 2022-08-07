<template>
  <v-dialog persistent v-model="show">
    <v-card>
      <v-card-text>
        <div class="d-flex">
          <h5 class="h5 mb-6">Connect Wallet</h5>
          <v-spacer />
          <v-btn flat density="compact" icon="mdi-close" @click="$emit('toggle-modal')" />
        </div>

        <v-list>
          <v-list-item
            border
            class="mb-3"
            v-for="(client, i) in clients"
            :key="i"
            :value="client.id"
            active-color="primary"
            @click="connect(client.id)"
          >
            <template v-slot:prepend>
              <v-avatar size="30">
                <v-img :src="client.logo" />
              </v-avatar>
            </template>

            <v-list-item-title v-text="client.name"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { walletAuthMessage } from "../../config"
import { connection, toast } from "../../utils"

export default {
  props: ["show"],
  emits: ["connect"],
  setup(_, ctx) {
    const clients = [
      { name: "Phantom", id: "phantom", logo: "/assets/images/phantom.svg" },
      { name: "Solflare", id: "solflare", logo: "/assets/images/solflare.svg" },
      { name: "Slope", id: "slope", logo: "/assets/images/slope.svg" },
    ]

    async function connect(client) {
      try {
        await connection.connect(client)
        const messageId = crypto.randomUUID()
        const signedMessage = await connection.signMessage(client, `${walletAuthMessage} ${messageId}`)

        ctx.emit("connect", { ...signedMessage, messageId })
      } catch (e) {
        toast.error(e.message)
      }
    }

    return { clients, connect }
  },
}
</script>
