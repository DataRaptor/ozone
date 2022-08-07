import { FastifyRequest, FastifyReply } from "fastify"
import { response } from "../utils"
import { Service } from "typedi"

@Service()
export class UserController {
  constructor() {}

  public async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request

    const data = {
      name: user.name,
      email: user.email,
      address: user.address,
      avatar: user.avatar,
    }

    return response.success(reply, { message: "User fetched successfuly", data })
  }
}
