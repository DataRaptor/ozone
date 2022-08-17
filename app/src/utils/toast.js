import { useToast } from "vue-toastification";

export const toast = {
  success(message) {
    const toast = useToast();
    toast.success(message);
  },

  error(message) {
    const toast = useToast();
    toast.error(message);
  },
};
