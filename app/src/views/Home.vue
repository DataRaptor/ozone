<template>
  <div class="d-flex justify-space-between">
    <div class="d-flex justify-center">
      <v-avatar class="mt-4" size="15">
        <v-img src="/assets/images/ozone.png" />
      </v-avatar>

      <h5 class="mt-2 h5" style="color: rgb(98, 0, 238)">zone finance</h5>
    </div>

    <v-btn link flat to="/settings" density="compact" v-if="authStore.token">Go to app</v-btn>
    <v-btn link flat to="/signup" density="compact" v-else>Signup</v-btn>
  </div>

  <header color="grey lighten-5">
    <v-container>
      <v-row class="mt-5">
        <v-col cols="12" md="6">
          <h2 class="h2 mb-3">The All-In-One crypto payment platform for Businesses</h2>
          <p class="text--secondary mb-10">
            We enable businesses to receive payments in crypto and also manage their crypto finances through P.O.S,
            Payment links, Invoices, Expenses and more.
          </p>

          <v-btn flat link to="/signup" color="primary">Get Started</v-btn>
        </v-col>

        <v-col cols="12" md="6">
          <v-img src="/assets/images/payment.svg" width="100%" />
        </v-col>
      </v-row>
    </v-container>
  </header>

  <h2 class="mb-3 text-center my-10">Features</h2>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" v-for="(feature, i) in features" :key="i">
        <v-card flat>
          <v-card-text>
            <div class="d-flex">
              <v-avatar size="50" :color="`${feature.color}`" class="mb-3 me-5">
                <v-icon style="color: white">{{ feature.icon }}</v-icon>
              </v-avatar>

              <div class="float-right">
                <p class="mb-3" style="font-size: 18px">{{ feature.title }}</p>
                <p class="">{{ feature.description }}</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <div class="mt-5 text-center">
    <p class="">&copy; {{ config.appName }} {{ new Date().getFullYear() }}</p>
  </div>
</template>

<style scoped>
h1 {
  font-size: 40px;
}
</style>
<script>
import { reactive, ref } from "vue";
import { config } from "../config";
import { useAuthStore } from "../stores";

export default {
  setup() {
    const drawer = ref(null);
    const authStore = useAuthStore();

    const features = reactive([
      {
        title: "Invoices",
        icon: "mdi-receipt",
        color: "primary",
        description: "Send invoices to your customers or clients.",
      },
      {
        title: "Payment links",
        icon: "mdi-link",
        color: "red",
        description: "Create and share payment links with anyone, anywhere in the world",
      },
      {
        title: "Point of Sale",
        icon: "mdi-point-of-sale",
        color: "green",
        description: "Receive payments in-person from your customers with our point of sale system",
      },
      {
        title: "Direct payments",
        icon: "mdi-credit-card",
        color: "purple",
        description: "We do not hold any of your payments. Payments are directly settled into your wallets",
      },
    ]);

    return { drawer, features, config, authStore };
  },
};
</script>
