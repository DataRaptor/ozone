import { createRouter, createWebHistory } from "vue-router"

import Signup from "./views/Signup.vue"
import Signin from "./views/Signin.vue"
import ClientList from "./views/client/List.vue"
import ClientView from "./views/client/View.vue"
import InvoiceList from "./views/invoice/List.vue"
import InvoiceDrafts from "./views/invoice/Drafts.vue"
import InvoiceNew from "./views/invoice/New.vue"
import InvoiceView from "./views/invoice/View.vue"
import InvoiceEdit from "./views/invoice/Edit.vue"
import Address from "./views/Address.vue"
import Pos from "./views/Pos.vue"
import Settings from "./views/Settings.vue"

const routes = [
  { path: "/pos", name: "pos", component: Pos },
  { path: "/signin", name: "signin", component: Signin },
  { path: "/signup", name: "signup", component: Signup },
  { path: "/settings", name: "settings", component: Settings },
  { path: "/addresses", name: "addresses", component: Address },

  { path: "/clients", name: "clientList", component: ClientList },
  { path: "/clients/:id", name: "clientView", component: ClientView },

  { path: "/invoices", name: "invoices", component: InvoiceList },
  { path: "/invoices/drafts", name: "invoiceDrafts", component: InvoiceDrafts },
  { path: "/invoices/new", name: "invoiceNew", component: InvoiceNew },
  { path: "/invoices/:id", name: "invoiceView", component: InvoiceView },
  { path: "/invoices/:id/edit", name: "invoiceEdit", component: InvoiceEdit },
]

export const router = createRouter({ history: createWebHistory(), routes })
