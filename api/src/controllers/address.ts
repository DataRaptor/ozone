import { FastifyRequest, FastifyReply } from "fastify"
import { response } from "../utils"
import { AddressService } from "../services"
import { Service } from "typedi"

@Service()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  public async addAddress(request: FastifyRequest, reply: FastifyReply) {
    const { body, user }: { [key: string]: any } = request
    const payload = {
      address: body.address,
      label: body.label,
    }

    const data = await this.addressService.addAddress(payload, user)
    return response.success(reply, { message: "Address added successfuly", data })
  }

  public async getAddresss(request: FastifyRequest, reply: FastifyReply) {
    const { user }: { [key: string]: any } = request
    const data = await this.addressService.getAddresses(user)

    return response.success(reply, { message: "Addresss fetched successfuly", data })
  }

  public async getAddress(request: FastifyRequest, reply: FastifyReply) {
    const { params, user }: { [key: string]: any } = request
    const payload = {
      id: params.id,
    }

    const data = await this.addressService.getAddress(payload, user)
    return response.success(reply, { message: "Address fetched successfuly", data })
  }

  public async updateAddress(request: FastifyRequest, reply: FastifyReply) {
    const { body, params, user }: { [key: string]: any } = request
    const payload = {
      id: params.id,
      address: {
        label: body.label,
        address: body.address,
      },
    }

    const data = await this.addressService.updateAddress(payload, user)
    return response.success(reply, { message: "Addresses updated successfuly", data })
  }

  public async deleteAddress(request: FastifyRequest, reply: FastifyReply) {
    const { params, user }: { [key: string]: any } = request
    const payload = {
      id: params.id,
    }

    const data = await this.addressService.deleteAddress(payload, user)
    return response.success(reply, { message: "Addresss deleted successfuly", data })
  }
}
