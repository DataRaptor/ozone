import { FastifyRequest, FastifyReply } from "fastify"
import { response } from "../utils/response"
import { TokenService } from "../services"
import { Service } from "typedi"

@Service()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  public async getTokens(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await this.tokenService.getTokens()

      return response.success(reply, { message: "Tokens fetched successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }

  public async getToken(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { params }: { [key: string]: any } = request
      const payload = {
        id: params.id,
      }

      const data = await this.tokenService.getToken(payload)
      return response.success(reply, { message: "Token fetched successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }
}
