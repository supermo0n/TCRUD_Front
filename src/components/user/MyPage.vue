<template>

  <!--  ROOT DIV START-->
  <div class="container">

    <!--    MyPage TAB START -->
    <b-tabs content-class="mt-3"
            nav-wrapper-class="text-white"
            active-nav-item-class="font-weight-bold dark"
            non-active-nav-item-class="font-secondary"
            active-tab-class="font-weight-bold">
      <b-tab title="회원정보" active>
        <ProfileView/>
      </b-tab>
      <b-tab title="내가 쓴 글"><p>업데이트 예정</p></b-tab>
      <b-tab title="내가 쓴 댓글"><p>업데이트 예정</p></b-tab>
    </b-tabs>
    <!--    MyPage TAB END-->

  </div>
  <!--  ROOT DIV END-->

  <!--  TODO : MyPage CLOSE-->
</template>

<script>

import ProfileView from "@/views/ProfileView.vue";

export default {
  components: {ProfileView},

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  // curreentUser === undefined -> login페이지 강제 이동
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }

  },
  methods:
      {},


}

</script>

<style scoped>

</style>