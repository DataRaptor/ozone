import { request } from "../config";
import { useAddressStore } from "../stores";

export class AddressService {
  async addAddress(data) {
    const addressStore = useAddressStore();

    const address = await request.api.post("/addresses", data);
    addressStore.addAddress(address.data);
    return address;
  }

  async updateAddress(id, data) {
    const addressStore = useAddressStore();

    const address = await request.api.put(`/addresses/${id}`, data);
    addressStore.setAddress(address.data);
    return address;
  }

  async loadAddresses() {
    const addressStore = useAddressStore();

    const addresses = await request.api.get("/addresses");
    addressStore.setAddresses(addresses.data);
    return addresses;
  }

  async loadAddress(id) {
    const addressStore = useAddressStore();

    const address = await request.api.get(`/addresses/${id}`);
    addressStore.setAddress(address.data);
    return address;
  }
}
