import { FastifyReply } from "fastify"

class Response {
  public success(reply: FastifyReply, { code, message, data }: { code?: number; message: string; data?: any }) {
    return reply
      .code(code || 200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ success: true, message, data })
  }

  public error(reply: FastifyReply, { code, message }: { code?: number; message: string }) {
    return reply
      .code(code || 500)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ success: false, message })
  }
}

export const response = new Response()
