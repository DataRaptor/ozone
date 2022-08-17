import { FastifyRequest, FastifyReply } from "fastify";
import { response } from "../utils";
import { TokenService } from "../services";
import { Service } from "typedi";

@Service()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  public async getTokens(_request: FastifyRequest, reply: FastifyReply) {
    const data = await this.tokenService.getTokens();
    return response.success(reply, { message: "Tokens fetched successfuly", data });
  }

  public async getToken(request: FastifyRequest, reply: FastifyReply) {
    const { params }: { [key: string]: any } = request;
    const payload = { id: params.id };

    const data = await this.tokenService.getToken(payload);
    return response.success(reply, { message: "Token fetched successfuly", data });
  }
}
