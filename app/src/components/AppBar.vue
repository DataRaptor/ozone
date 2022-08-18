<template>
  <section>
    <div class="d-flex pa-2">
      <v-btn class="d-block d-md-none" icon="mdi-menu" variant="text" @click.stop="drawer = !drawer"></v-btn>
      <v-spacer />

      <v-btn variant="text" prepend-icon="mdi-account">
        {{ user.name || utils.truncateAddress(user.address) }}

        <v-menu activator="parent">
          <v-list>
            <v-list-item link to="/settings" density="compact" prepend-icon="mdi-cog-outline" title="Settings" />
            <v-list-item link density="compact" prepend-icon="mdi-logout" title="Logout" @click="logOut" />
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
                  @click="toggleModal('newCompany')"
                />

                <v-divider class="my-1" />

                <template v-if="companies.length > 0">
                  <template v-for="(c, i) in companies">
                    <v-list-item
                      density="compact"
                      append-icon="mdi-arrow-right"
                      class="py-2"
                      :value="i"
                      :title="c.name"
                      @click="switchCompany(c.id)"
                      v-if="company.id != c.id"
                    />
                  </template>
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
          <v-btn block flat color="primary" variant="tonal" @click="logOut">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </section>

  <NewCompany :show="state.modals.newCompany" @toggle-modal="toggleModal('newCompany')" />
</template>

<script>
import { reactive, ref } from "vue";
import { config } from "../config";
import { storeToRefs } from "pinia";
import { useAuthStore, useCompanyStore } from "../stores";
import { utils } from "../utils";
import NewCompany from "./modals/company/New.vue";
import Empty from "./Empty.vue";
import { authService, companyService } from "../services";
import { useRouter } from "vue-router";

export default {
  components: { Empty, NewCompany },
  setup() {
    const { user } = storeToRefs(useAuthStore());
    const { company, companies } = storeToRefs(useCompanyStore());
    const drawer = ref(null);
    const router = useRouter();
    const state = reactive({ modals: { newCompany: null } });
    const items = [
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
        title: "Payments",
        icon: "mdi-credit-card-outline",
        children: [
          {
            title: "Point Of Sale",
            path: "/payments/pos",
          },
          {
            title: "Payment links",
            path: "/payments/links",
          },
          {
            title: "Payments history",
            path: "/payments/history",
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
    ];

    function toggleModal(p) {
      state.modals[p] = !state.modals[p];
    }

    function switchCompany(id) {
      companyService.switchCompany(id);
      window.location.href = "/";
    }

    function logOut() {
      authService.signOut();
      router.push("/signup");
    }

    return { state, drawer, items, user, config, company, companies, utils, toggleModal, switchCompany, logOut };
  },
};
</script>
