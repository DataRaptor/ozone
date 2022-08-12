import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import jwt from "@fastify/jwt"
import cors from "@fastify/cors"
import { routes } from "../src/routes"
import { environment } from "../src/config/environment"
import { auth } from "./decorators/auth"
import { response } from "./utils"

export const app = fastify({ logger: true })

app.register(cors, {})
app.register(jwt, { secret: environment.jwtSecret })
app.decorate("authenticate", auth)
app.register(routes)

app.setErrorHandler((error: FastifyError & { status: number }, request, reply) => {
  request.log.error(error)

  response.error(reply, { status: error.status, message: error.message })
})
