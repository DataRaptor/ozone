<template>
  <v-app>
    <AppBar v-if="$route.query.bar != '0' && !exludes.includes($route.name)" />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import AppBar from "./components/AppBar.vue";
import { authService, companyService } from "./services";
import { useAuthStore } from "./stores";
import { toast } from "./utils";

export default {
  name: "App",
  components: { AppBar },

  setup() {
    const exludes = ["home", "signup", "signin", "paymentLinkPay"];
    const { token } = storeToRefs(useAuthStore());

    onMounted(async () => {
      try {
        if (!!token.value) {
          await Promise.all([authService.loadAuthenticatedUser(), companyService.loadCompanies()]);
        }
      } catch (e) {
        toast.error(e.message);
      }
    });
    return { exludes };
  },
};
</script>
