import { createRouter, createWebHistory } from "vue-router";

import Home from "./views/Home.vue";
import Signup from "./views/Signup.vue";
import Signin from "./views/Signin.vue";
import ClientList from "./views/client/List.vue";
import ClientView from "./views/client/View.vue";
import PaymentLinkList from "./views/paymentLink/List.vue";
import PaymentLinkPay from "./views/paymentLink/Pay.vue";
import InvoiceList from "./views/invoice/List.vue";
import InvoiceDrafts from "./views/invoice/Drafts.vue";
import InvoiceNew from "./views/invoice/New.vue";
import InvoiceView from "./views/invoice/View.vue";
import InvoiceEdit from "./views/invoice/Edit.vue";
import AddressList from "./views/address/List.vue";
import AddressView from "./views/address/View.vue";
import PosPayment from "./views/payment/Pos.vue";
import PaymentHistory from "./views/payment/History.vue";
import Settings from "./views/Settings.vue";
import { useAuthStore } from "./stores";

const routes = [
  { path: "/", name: "home", component: Home, meta: {} },
  { path: "/signin", name: "signin", component: Signin, meta: { guest: true } },
  { path: "/signup", name: "signup", component: Signup, meta: { guest: true } },
  { path: "/settings", name: "settings", component: Settings, meta: { auth: true } },

  { path: "/addresses", name: "addresses", component: AddressList, meta: { auth: true } },
  { path: "/addresses/:id", name: "address/View", component: AddressView, meta: { auth: true } },

  { path: "/clients", name: "clientList", component: ClientList, meta: { auth: true } },
  { path: "/clients/:id", name: "clientView", component: ClientView, meta: { auth: true } },

  { path: "/payments/pos", name: "posPayment", component: PosPayment, meta: { auth: true } },
  { path: "/payments/links", name: "paymentLinkList", component: PaymentLinkList, meta: { auth: true } },
  { path: "/payments/history", name: "paymentHistory", component: PaymentHistory, meta: { auth: true } },
  { path: "/pay/:id", name: "paymentLinkPay", component: PaymentLinkPay, meta: {} },

  { path: "/invoices", name: "invoices", component: InvoiceList, meta: { auth: true } },
  { path: "/invoices/drafts", name: "invoiceDrafts", component: InvoiceDrafts, meta: { auth: true } },
  { path: "/invoices/new", name: "invoiceNew", component: InvoiceNew, meta: { auth: true } },
  { path: "/invoices/:id", name: "invoiceView", component: InvoiceView, meta: {} },
  { path: "/invoices/:id/edit", name: "invoiceEdit", component: InvoiceEdit, meta: { auth: true } },
];

export const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.auth) {
    if (authStore.token) {
      return true;
    } else {
      return "/signup";
    }
  } else if (to.meta.guest) {
    if (!authStore.token) {
      true;
    } else {
      return "/settings";
    }
  }

  return true;
});
