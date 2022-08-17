import { FastifyRequest, FastifyReply } from "fastify";
import { response } from "../utils";
import { ClientService } from "../services";
import { Service } from "typedi";

@Service()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  public async addClient(request: FastifyRequest, reply: FastifyReply) {
    const { body, user, company }: { [key: string]: any } = request;

    const payload = {
      email: body.email,
      name: body.name,
      phone: body.phone,
      taxNumber: body.taxNumber,
      city: body.city,
      line1: body.line1,
      state: body.state,
      country: body.country,
      postalCode: body.postalCode,
    };

    const data = await this.clientService.addClient(payload, { user, company });
    return response.success(reply, { message: "Client added successfuly", data });
  }

  public async getClients(request: FastifyRequest, reply: FastifyReply) {
    const { user, company }: { [key: string]: any } = request;

    const data = await this.clientService.getClients({ user, company });
    return response.success(reply, { message: "Clients fetched successfuly", data });
  }

  public async getClient(request: FastifyRequest, reply: FastifyReply) {
    const { params, user, company }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
    };
    const data = await this.clientService.getClient(payload, { user, company });
    return response.success(reply, { message: "Client fetched successfuly", data });
  }

  public async updateClient(request: FastifyRequest, reply: FastifyReply) {
    const { body, params, user, company }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
      client: {
        email: body.email,
        name: body.name,
        phone: body.phone,
        taxNumber: body.taxNumber,
        city: body.city,
        line1: body.line1,
        state: body.state,
        country: body.country,
        postalCode: body.postalCode,
      },
    };

    const data = await this.clientService.updateClient(payload, { user, company });
    return response.success(reply, { message: "Client updated successfuly", data });
  }

  public async deleteClient(request: FastifyRequest, reply: FastifyReply) {
    const { params, user, company }: { [key: string]: any } = request;
    const payload = {
      id: params.id,
    };

    const data = await this.clientService.deleteClient(payload, { user, company });
    return response.success(reply, { message: "Client deleted successfuly", data });
  }
}
