<template>
  <v-app>
    <AppBar v-if="!exludes.includes($route.name)" />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted } from "vue";
import AppBar from "./components/AppBar.vue";
import { authService, companyService } from "./services";
import { toast } from "./utils";

export default {
  name: "App",
  components: { AppBar },

  setup() {
    const exludes = ["signup", "signin"];

    onMounted(async () => {
      try {
        await Promise.all([authService.loadAuthenticatedUser(), companyService.loadCompanies()]);
      } catch (e) {
        toast.error(e.message);
      }
    });
    return { exludes };
  },
};
</script>
