import axios from "axios";
import { useRouter } from "vue-router";
import { authService } from "../services";
import { useAuthStore, useCompanyStore } from "../stores";
import { config } from "./";

export const request = {
  get api() {
    const api = axios.create({
      baseURL: config.api.baseUrl,
      headers: {
        Authorization: useAuthStore().token ? `Bearer ${useAuthStore().token}` : undefined,
        "x-company-id": useCompanyStore().currentId,
      },
    });

    api.interceptors.response.use(
      function (response) {
        return response.data;
      },
      function (error) {
        if (error.response.status == 401) {
          const router = useRouter();
          authService.signOut();
          router.push("/signup");
        }

        return Promise.reject(error.response.data);
      }
    );

    return api;
  },
};
