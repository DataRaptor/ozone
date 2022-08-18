import { storeToRefs } from "pinia";
import { request } from "../config";
import { useAuthStore } from "../stores";

export class UserService {
  async updateUser(data) {
    const authStore = useAuthStore();
    const payload = { name: data.name, email: data.email };

    const result = await request.api.put("/users/me", { ...payload });
    authStore.setUserData(result.data);
    return result;
  }

  async updateUserPassword(data) {
    const authStore = useAuthStore();
    const payload = { newPassword: data.newPassword };
    if (data.oldPassword) {
      payload.oldPassword = data.oldPassword;
    } else {
      payload.repeatPassword = data.repeatPassword;
    }

    const result = await request.api.put("/users/me/password", { ...payload });
    authStore.setUserData(result.data);
    return result;
  }
}
