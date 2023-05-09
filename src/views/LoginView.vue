<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
          id="profile-img"
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="profile-img-card"
      />
      <form name="form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">ID</label>

          <input
              v-model="user.username"
              v-validate="'required'"
              type="text"
              class="form-control"
              name="username"
          />
          <div
              v-if="errors.has('username')"
              class="alert alert-danger"
              role="alert"
          >
            회원ID가 필요합니다.
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
              v-model="user.password"
              v-validate="'required'"
              type="password"
              class="form-control"
              name="password"
              autocomplete="password"
          />
          <div
              v-if="errors.has('password')"
              class="alert alert-danger"
              role="alert"
          >
            비밀번호가 필요합니다.
          </div>
        </div>
        <!-- 버튼 시작 -->
        <div class="form-group mt-3">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
            ></span>
            <span>Login</span>
          </button>
        </div>
        <!-- 버튼 끝 -->
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import User from "../model/user.js";

export default {
  data() {
    return {
      user: new User("", ""),
      loading: false,
      message: "",
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },

  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {

    handleLogin() {
      this.loading = true;
      this.$validator.validateAll().then((isValid) => {
        if (!isValid) {
          this.loading = false;
          return;
        }

        if (this.user.username && this.user.password) {
          this.$store
              .dispatch("auth/login", this.user)
              .then(() => {
                this.$router.push("/profile");
              })

              .catch((error) => {
                this.loading = false;
                this.message =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
              });
        }
      });
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/Login.css";
</style>
