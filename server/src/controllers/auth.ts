import { FastifyRequest, FastifyReply } from "fastify";
import { response } from "../utils";
import { AuthService } from "../services";
import { Service } from "typedi";

@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async signupUser(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;
    const payload = {
      name: body.name,
      email: body.email,
      password: body.password,
      address: body.address,
      signature: body.signature,
      messageId: body.messageId,
      mode: body.mode,
    };

    const result = await this.authService.signUpUser(payload);
    return response.success(reply, { message: "Signup successful", data: result });
  }

  public async signinUser(request: FastifyRequest, reply: FastifyReply) {
    const { body }: { [key: string]: any } = request;
    const payload = {
      email: body.email,
      password: body.password,
      address: body.address,
      signature: body.signature,
      messageId: body.messageId,
      mode: body.mode,
    };

    const result = await this.authService.signInUser(payload);
    return response.success(reply, { message: "Signin successful", data: result });
  }
}
