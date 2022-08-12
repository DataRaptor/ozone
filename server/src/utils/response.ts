import { FastifyReply } from "fastify"

class Response {
  public success(reply: FastifyReply, { status, message, data }: { status?: number; message: string; data?: any }) {
    return reply
      .code(status || 200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ success: true, message, data })
  }

  public error(reply: FastifyReply, { status, message }: { status?: number; message: string }) {
    return reply
      .code(status || 500)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ success: false, message })
  }
}

export const response = new Response()
