import { request } from "../config";
import { useClientStore } from "../stores";

export class ClientService {
  async addClient(data) {
    const clientStore = useClientStore();

    const client = await request.api.post("/clients", data);
    clientStore.addClient(client.data);
  }

  async loadClients() {
    const clientStore = useClientStore();

    const clients = await request.api.get("/clients");
    clientStore.setClients(clients.data);
  }

  async updateClient(id, data) {
    const clientStore = useClientStore();

    console.log(data);
    const clients = await request.api.put(`/clients/${id}`, data);
    clientStore.updateClient(clients.data);
  }

  async loadClient(id) {
    const clientStore = useClientStore();

    const client = await request.api.get(`/clients/${id}`);
    clientStore.setClient(client.data);
  }
}
