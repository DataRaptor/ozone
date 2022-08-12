import { FastifyInstance } from "fastify"
import { auth } from "./auth"
import { user } from "./user"
import { token } from "./token"
import { client } from "./client"
import { address } from "./address"
import { company } from "./company"
import { invoice } from "./invoice"

export async function routes(app: FastifyInstance) {
  app.register(auth, { prefix: "auth" })
  app.register(user, { prefix: "users" })
  app.register(client, { prefix: "clients" })
  app.register(address, { prefix: "addresses" })
  app.register(token, { prefix: "tokens" })
  app.register(invoice, { prefix: "invoices" })
  app.register(company, { prefix: "companies" })
}
