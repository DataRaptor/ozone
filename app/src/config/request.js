import axios from "axios";
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
          console.log("Invalid auth details");
        }

        return Promise.reject(error.response.data);
      }
    );

    return api;
  },
};
