<template>
  <section>
    <div class="d-flex pa-2">
      <v-btn class="d-block d-md-none" icon="mdi-menu" variant="text" @click.stop="drawer = !drawer"></v-btn>
      <v-spacer />

      <v-btn variant="text" prepend-icon="mdi-account">
        {{ user.name || utils.truncateAddress(user.address) }}

        <v-menu activator="parent">
          <v-list>
            <v-list-item density="compact" prepend-icon="mdi-cog-outline" link title="Settings" />
            <v-list-item density="compact" prepend-icon="mdi-logout" link title="Sign out" />
          </v-list>
        </v-menu>
      </v-btn>
    </div>

    <v-navigation-drawer v-model="drawer">
      <template v-slot:prepend>
        <div class="d-flex my-3 justify-center">
          <v-avatar class="mt-4" size="15">
            <v-img src="/assets/images/ozone.png" />
          </v-avatar>

          <h5 class="mt-2 h5" style="color: rgb(98, 0, 238)">zone finance</h5>
        </div>

        <v-list nav class="nav-sub-list">
          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item
                border
                lines="two"
                v-bind="props"
                density="compact"
                id="menu-activator"
                :title="company.name"
                class="font-weight-medium"
                :subtitle="user.name || utils.truncateAddress(user.address)"
              />
            </template>

            <v-menu activator="#menu-activator" location="bottom">
              <v-list nav density="compact" style="width: 230px">
                <v-list-item
                  link
                  density="compact"
                  prepend-icon="mdi-plus"
                  title="Add new company"
                  class="font-weight-medium secondary-text"
                />

                <v-divider class="my-1" />

                <template v-if="companies.length > 0">
                  <v-list-item
                    density="compact"
                    append-icon="mdi-arrow-right"
                    v-for="(company, i) in companies"
                    class="py-2"
                    :key="i"
                    :value="i"
                    :title="company.name"
                  />
                </template>
                <div v-else class="py-3">
                  <Empty message="No other companies yet" />
                </div>
              </v-list>
            </v-menu>
          </v-list-group>
        </v-list>
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
          <v-btn block flat color="primary" variant="tonal">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </section>
</template>

<script>
import { ref } from "vue";
import { config } from "../config";
import { storeToRefs } from "pinia";
import { useAuthStore, useCompanyStore } from "../stores";
import { utils } from "../utils";
import Empty from "./Empty.vue";

export default {
  components: { Empty },
  setup() {
    const { user } = storeToRefs(useAuthStore());
    const { company, companies } = storeToRefs(useCompanyStore());
    const drawer = ref(null);
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
        title: "Payment Links",
        icon: "mdi-link",
        path: "/payment-links",
      },
      {
        title: "Point Of Sale",
        icon: "mdi-point-of-sale",
        path: "/pos",
      },
    ];
    return { drawer, items, user, config, company, companies, utils };
  },
};
</script>

<!-- 
<style>
nav,
nav .v-list,
.nav-sub-list,
.v-overlay__content {
  /* background-color: #fafafa !important; */
}
</style> -->
