<template>
  <div class="d-flex mb-5">
    <h5 class="h5">Payment History</h5>
  </div>

  <Loader v-if="state.loading" />
  <template v-else>
    <Payments v-if="payments.length > 0" :all="true" :payments="payments" />
    <Empty v-else message="No payments yet" />
  </template>
</template>

<script>
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";
import { paymentService } from "../../services";
import { usePaymentStore } from "../../stores";
import Payments from "../../components/tables/Payments.vue";
import Empty from "../../components/Empty.vue";
import Loader from "../../components/Loader.vue";

export default {
  setup() {
    const { payments } = storeToRefs(usePaymentStore());
    const state = reactive({ loading: false });

    onMounted(async () => {
      state.loading = true;
      await paymentService.getPayments({});
      state.loading = false;
    });

    return { state, payments };
  },
  components: { Payments, Empty, Loader },
};
</script>
