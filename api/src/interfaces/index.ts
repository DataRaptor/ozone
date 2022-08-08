import { FastifyInstance } from "fastify"

export * from "./auth"
export * from "./client"
export * from "./address"
export * from "./token"
export * from "./company"
export * from "./invoice"

export interface AppInstance extends FastifyInstance {
  authenticate?: any
}
