import { FastifyRequest, FastifyReply } from "fastify"
import { response } from "../utils/response"
import { ClientService } from "../services"
import { Service } from "typedi"

@Service()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  public async addClient(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { body, user }: { [key: string]: any } = request

      const payload = {
        email: body.email,
        name: body.name,
        companyName: body.companyName,
        firstName: body.firstName,
        lastName: body.lastName,
        taxNumber: body.taxNumber,
        city: body.city,
        line1: body.line1,
        state: body.state,
        country: body.country,
        postalCode: body.postalCode,
      }

      const data = await this.clientService.addClient(payload, user)
      return response.success(reply, { message: "Client added successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }

  public async getClients(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { user }: { [key: string]: any } = request

      const data = await this.clientService.getClients(user)
      return response.success(reply, { message: "Clients fetched successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }

  public async getClient(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { params, user }: { [key: string]: any } = request
      const payload = {
        id: params.id,
      }
      const data = await this.clientService.getClient(payload, user)
      return response.success(reply, { message: "Client fetched successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }

  public async updateClient(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { body, params, user }: { [key: string]: any } = request
      const payload = {
        id: params.id,
        client: {
          email: body.email,
          name: body.name,
          companyName: body.companyName,
          firstName: body.firstName,
          lastName: body.lastName,
          taxNumber: body.taxNumber,
          city: body.city,
          line1: body.line1,
          state: body.state,
          country: body.country,
          postalCode: body.postalCode,
        },
      }

      const data = await this.clientService.updateClient(payload, user)
      return response.success(reply, { message: "Clients updated successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }

  public async deleteClient(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { params, user }: { [key: string]: any } = request
      const payload = {
        id: params.id,
      }

      const data = await this.clientService.deleteClient(payload, user)
      return response.success(reply, { message: "Clients deleted successfuly", data })
    } catch (e) {
      request.log.error(e)
      return response.error(reply, { message: "An error occured" })
    }
  }
}
