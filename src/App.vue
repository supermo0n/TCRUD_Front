<template>
  <div id="app">
    <NavComomponent />

    <div class="container mt-3">
      <router-view />
    </div>

  </div>
</template>

<script>
import NavComomponent from "./components/common/NavCom.vue";
export default {
  components: {
    NavComomponent,
  },

}
</script>
