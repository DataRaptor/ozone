<template>
  <div class="d-flex mb-5">
    <h5 class="h5">Payment History</h5>
  </div>

  <Payments v-if="payments.length > 0" :all="true" :payments="payments" />
  <Empty v-else message="No payments yet" />
</template>

<script>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { paymentService } from "../../services";
import { usePaymentStore } from "../../stores";
import Payments from "../../components/tables/Payments.vue";
import Empty from "../../components/Empty.vue";

export default {
  setup() {
    const { payments } = storeToRefs(usePaymentStore());
    onMounted(async () => {
      await paymentService.getPayments({});
    });
    return { payments };
  },
  components: { Payments, Empty },
};
</script>
