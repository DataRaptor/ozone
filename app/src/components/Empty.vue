<template>
  <div class="d-block mx-auto text-center mt-3">
    <p class="secondary-text">{{ message || "Ooops... This is empty" }}</p>
  </div>
</template>

<script>
export default {
  props: ["message"],
}
</script>
