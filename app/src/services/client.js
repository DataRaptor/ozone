import { request } from "../config";
import { useClientStore } from "../stores";

export class ClientService {
  async addClient(data) {
    const clientStore = useClientStore();

    const client = await request.api.post("/clients", data);
    clientStore.addClient(client.data);
    return client;
  }

  async loadClients() {
    const clientStore = useClientStore();

    const clients = await request.api.get("/clients");
    clientStore.setClients(clients.data);
    return clients;
  }

  async updateClient(id, data) {
    const clientStore = useClientStore();

    const client = await request.api.put(`/clients/${id}`, data);
    clientStore.updateClient(clients.data);
    return client;
  }

  async loadClient(id) {
    const clientStore = useClientStore();

    const client = await request.api.get(`/clients/${id}`);
    clientStore.setClient(client.data);
    return client;
  }
}
