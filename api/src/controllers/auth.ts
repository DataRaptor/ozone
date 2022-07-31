import { FastifyRequest, FastifyReply } from "fastify"
import { response } from "../utils/response"
import { AuthService } from "../services"
import { Service } from "typedi"

@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async signupUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { body }: { [key: string]: any } = request
      const payload = {
        name: body.name,
        email: body.email,
        password: body.password,
        address: body.address,
        mode: body.mode,
      }

      const result = await this.authService.signupUser(payload)
      return response.success(reply, { message: "Signup successful", data: result })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }

  public async signinUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { body }: { [key: string]: any } = request
      const payload = {
        email: body.email,
        password: body.password,
        address: body.address,
        mode: body.mode,
      }

      const result = await this.authService.signinUser(payload)
      return response.success(reply, { message: "Signin successful", data: result })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }
}
