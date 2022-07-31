import fastify, { FastifyReply, FastifyRequest } from "fastify"
import { environment } from "../src/config/environment"
import { routes } from "../src/routes"
import jwt from "@fastify/jwt"
import { auth } from "./decorators/auth"

export const app = fastify({ logger: true })

app.register(jwt, { secret: environment.jwtSecret })
app.decorate("authenticate", auth)
app.register(routes)
