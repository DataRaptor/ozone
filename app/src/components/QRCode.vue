<template>
  <div id="qrCodeContainer"></div>
</template>

<script>
import { onMounted, reactive, watch } from "vue";
import { solanapay } from "../utils";

export default {
  props: ["payment"],
  setup(props) {
    const state = reactive({ size: getQRCodeSize() });

    function getQRCodeSize() {
      return typeof window === "undefined" ? 400 : Math.min(window.screen.availWidth - 48, 400);
    }

    function renderQRCode() {
      const container = document.querySelector("#qrCodeContainer");
      const el = document.querySelector("#qrCode");
      if (!!el) {
        el.remove();
      }

      const qr = solanapay.getQR(props.payment, state.size);
      const div = document.createElement("div");

      qr.append(div);

      div.setAttribute("id", "qrCode");
      container.appendChild(div);
    }

    onMounted(() => {
      window.addEventListener("resize", () => {
        state.size = getQRCodeSize();
      });

      renderQRCode();
    });

    watch(
      () => state.size,
      () => renderQRCode()
    );
  },
};
</script>
