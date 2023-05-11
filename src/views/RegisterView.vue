<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
          id="profile-img"
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="profile-img-card"
      />
      <form name="form" @submit.prevent="handleRegister">
        <div v-if="!successful">

          <div class="form-group">
            <label for="username">ID</label>
            <input
                id="usernameform"
                v-model="user.username"
                v-validate="{ required: true, min:6, max:20, regex: /^[a-zA-Z0-9]+$/ }"
                type="text"
                class="form-control"
                name="username"
                v-b-tooltip.hover.bottomright="{ variant: 'primary' }" title="ID는 6-20자, 영어 대/소문자와 숫자만 사용하세요."

            />
            <div
                v-if="submitted && errors.has('username')"
                class="alert-danger"
            >
              <span> 회원 ID는 6-20자, 영어 대/소문자와 숫자로만 이루어져야 합니다. </span>
            </div>
          </div>

          <div class="form-group">
            <label for="nickname">Nickname</label>
            <input
                v-model="user.nickname"
                v-validate="{ required: true, min:3, max:10, regex: /^[a-zA-Z0-9ㄱ-ㅎ가-힣]*$/ }"
                type="text"
                class="form-control"
                name="nickname"
                v-b-tooltip.hover.bottomright="{ variant: 'primary' }" title="닉네임은 3-10자, 영어 대/소문자와 한글, 숫자만 사용하세요."
            />
            <div v-if="submitted && errors.has('nickname')" class="alert-danger">
              <span> 닉네임은 3-10자, 영어 대/소문자와 한글, 숫자로만 이루어져야 합니다. </span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
                v-model="user.email"
                v-validate="'required|email|max:50'"
                type="email"
                class="form-control"
                name="email"
            />
            <div v-if="submitted && errors.has('email')" class="alert-danger">
              {{ errors.first("email") }}
            </div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>

            <input
                v-model="user.password"
                v-validate="{ required: true, min:6, max:20, regex: /^[a-zA-Z0-9!@#$%^]*$/i }"
                type="password"
                class="form-control"
                name="password"
                v-b-tooltip.hover.bottomright="{ variant: 'primary' }" title="패스워드는 6-20자, 영어 대/소문자, 숫자, !@#$%^ 만 사용할수 있습니다."
            />
            <div
                v-if="submitted && errors.has('password')"
                class="alert-danger"
            >
              <span> 패스워드는 6-20자, 영어 대/소문자, 숫자, !@#$%^ 만을 사용할 수 있습니다. </span>
            </div>
          </div>

          <!-- 회원 가입 버튼 -->
          <div class="form-group mt-3">
            <button class="btn btn-primary btn-block">
              가입
            </button>
          </div>
          <!-- 회원 가입 버튼 -->
        </div>
      </form>
      <p></p>
      <div
          v-if="message"
          class="alert"
          :class="successful ? 'alert-success' : 'alert-danger'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import User from "../model/user";

export default {
  data() {
    return {
      user: new User("", "", "", "", "ROLE_USER"),
      submitted: false,
      successful: false,
      message: "",

      popoverVisible: false
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    passwordPattern() {
      return /^[a-zA-Z0-9!@#$%^]{6,20}$/;
    },
    nicknamePattern(){
      return /^[a-zA-Z0-9ㄱ-ㅎ가-힣]{3,10}$/;
    },
    usernamePattern(){
      return /^[a-zA-Z0-9]+$/;
    }
  },

  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {

    handleRegister() {
      this.message = "";
      this.submitted = true;
      this.$validator.validateAll().then((isValid) => {
        if (!isValid) {
          return;
        }

        this.$store.dispatch("auth/register", this.user)
            .then((response) => {
              this.message = response.message;
              this.successful = true;
            })
            .catch((error) => {
              this.successful = false;
              this.message =
                  (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                  error.message ||
                  error.toString();
            });
      });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/Register.css";

</style>
