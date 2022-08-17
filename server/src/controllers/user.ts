import { FastifyRequest, FastifyReply } from "fastify";
import { response } from "../utils";
import { Service } from "typedi";
import { UserService } from "../services";

@Service()
export class UserController {
  constructor(private readonly userService: UserService) {}

  public async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request;

    const data = {
      name: user.name,
      email: user.email,
      address: user.address,
      avatar: user.avatar,
      hasPassword: !!user.password ? true : false,
    };

    return response.success(reply, { message: "User fetched successfuly", data });
  }

  public async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;
    const payload = {
      email: body.email,
      name: body.name,
    };

    const data = await this.userService.updateUser(payload, { user });
    return response.success(reply, { message: "User updated successfuly", data });
  }

  public async updateUserPassword(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request;
    const payload: any = {
      newPassword: body.newPassword,
    };

    if (body.oldPassword) {
      payload.oldPassword = body.oldPassword;
    } else {
      payload.repeatPassword = body.repeatPassword;
    }

    const data = await this.userService.updateUserPassword(payload, { user });
    return response.success(reply, { message: "Password updated successfuly", data });
  }
}
