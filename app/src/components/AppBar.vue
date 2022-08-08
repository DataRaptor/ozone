<template>
  <div class="mb-5">
    <div class="d-flex pa-2">
      <v-btn class="d-block d-md-none" icon="mdi-menu" variant="text" @click.stop="drawer = !drawer"></v-btn>
      <v-spacer />

      <v-btn variant="text" prepend-icon="mdi-account">
        {{ user.name || user.address }}

        <v-menu activator="parent">
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index" :value="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>

    <v-navigation-drawer v-model="drawer">
      <template v-slot:prepend>
        <v-list-item
          link
          class="py-3"
          two-line
          :prepend-avatar="user.avatar || `${config.avatarApiBaseUrl}?name=${user.name || user.address}`"
          :title="user.name || user.address"
          subtitle="Logged in"
        >
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list nav>
        <template v-for="(item, i) in items" :key="i">
          <v-list-group active-color="primary" v-if="item.children">
            <template v-slot:activator="{ props }">
              <v-list-item
                class="font-weight-medium"
                active-color="primary"
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
              />
            </template>

            <v-list-item
              link
              :key="i"
              :to="child.path"
              class="font-weight-medium"
              :title="child.title"
              active-color="primary"
              :prepend-icon="child.icon"
              v-for="(child, i) in item.children"
            />
          </v-list-group>

          <v-list-item
            link
            v-else
            :to="item.path"
            class="font-weight-medium"
            :title="item.title"
            active-color="primary"
            :prepend-icon="item.icon"
          />
        </template>

        <v-divider class="my-3" />

        <v-list-item
          link
          to="/settings"
          title="Settings"
          class="font-weight-medium"
          active-color="primary"
          prepend-icon="mdi-cog-outline"
        />
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { storeToRefs } from "pinia"
import { ref } from "vue"
import { config } from "../config"
import { useAuthStore } from "../stores"

export default {
  setup() {
    const { user } = storeToRefs(useAuthStore())
    const drawer = ref(null)
    const items = [
      {
        title: "Overview",
        icon: "mdi-view-dashboard-outline",
      },
      {
        title: "Invoices",
        icon: "mdi-receipt",
        children: [
          {
            title: "New Invoice",
            path: "/invoices/new",
          },
          {
            title: "Sent Invoices",
            path: "/invoices",
          },
          {
            title: "Drafts",
            path: "/invoices/drafts",
          },
        ],
      },
      {
        title: "Clients",
        icon: "mdi-account-multiple-outline",
        path: "/clients",
      },
      {
        title: "Address List",
        icon: "mdi-wallet-outline",
        path: "/addresses",
      },
      {
        title: "Point Of Sale",
        icon: "mdi-point-of-sale",
        path: "/pos",
      },
    ]

    return { drawer, items, user, config }
  },
}
</script>
