import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "../database/prisma"
import { response } from "../utils/response"

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const data: any = await request.jwtVerify()
    const user = await prisma.user.findUnique({ where: { id: data.id } })

    if (!user) {
      throw new Error("Authorization token is invalid")
    }

    request.user = user
  } catch (err: any) {
    response.error(reply, { message: err.message, status: 401 })
  }
}
