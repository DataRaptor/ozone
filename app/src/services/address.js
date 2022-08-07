import { request } from "../config"
import { useAddressStore } from "../stores"

export class AddressService {
  async addAddress(data) {
    const addressStore = useAddressStore()

    const address = await request.api.post("/addresses", data)
    addressStore.addAddress(address.data)
  }

  async updateAddress(id, data) {
    const addressStore = useAddressStore()

    const address = await request.api.put(`/addresses/${id}`, data)
    addressStore.updateAddress(address.data)
  }

  async loadAddresses() {
    const addressStore = useAddressStore()

    const addresses = await request.api.get("/addresses")
    addressStore.setAddresses(addresses.data)
  }
}
