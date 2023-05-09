<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark bg-gradient">
    <div class="container-fluid">
      <router-link
          to="/about"
          class="navbar-brand"
      >
        T-CRUD
      </router-link>
      <!--      <a-->
      <!--          span="3px"-->
      <!--          class="navbar-brand"-->
      <!--          type="button"-->
      <!--          href="/about"-->
      <!--      >-->
      <!--        T-CRUD-->
      <!--      </a>-->

      <!--      NAV MENU START -->
      <div class="collapse navbar-collapse d-flex justify-content-between">
        <!--      NAV MENU BOARD START -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link
                to="/board"
                class="nav-link"
            >
              BOARD
            </router-link>
            <!--            <a-->
            <!--                class="nav-link"-->
            <!--                href="/board"-->
            <!--                id="navbarMenuLink"-->
            <!--                role="button"-->
            <!--            >-->
            <!--              BOARD-->
            <!--            </a>-->
          </li>
          <!--      NAV MENU BOARD CLOSE -->

          <!-- NAV MENU ADMIN START -->
          <li class="nav-item dropdown" v-if="showAdminBoard">
            <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
              Admin
            </a>
            <ul
                class="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <router-link
                    to="/user"
                    class="dropdown-item"
                >
                  User
                </router-link>
              </li>
              <li>
                <router-link
                    to="/add-user"
                    class="dropdown-item"
                >
                  Add
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
        <!-- NAV MENU ADMIN CLOSE -->

        <!--      NAV MENU LOGIN START -->
        <div v-if="!currentUser" class="navbar-nav ml-auto">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link
                  to="/register"
                  class="nav-link"
              >
                <font-awesome-icon icon="user-plus"/>
                Sign Up
              </router-link>
            </li>

            <li class="nav-item">
              <router-link
                  to="/login"
                  class="nav-link"
              >
                <font-awesome-icon icon="sign-in-alt"/>
                Login
              </router-link>
            </li>
          </ul>
        </div>
        <!--      NAV MENU LOGIN CLOSE -->

        <!--      NAV MENU LOGOUT START -->
        <div v-if="currentUser" class="navbar-nav ml-auto">
          <ul class="navbar-nav">
            <li class="nav-item">
              <!--              <router-link to="/profile" class="nav-link">-->
              <router-link
                  to="/mypage"
                  class="nav-link"
              >
                <font-awesome-icon icon="user"/>
                {{ currentUser.nickname }} / {{ currentUser.username }}
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href @click.prevent="logout">
                <font-awesome-icon icon="sign-out-alt"/>
                logout
              </a>
            </li>
          </ul>
        </div>
        <!--      NAV MENU LOGOUT START -->

      </div>
      <!--      NAV MENU CLOSE -->
    </div>
  </nav>
</template>

<script>
import jwtDecode from "jwt-decode";

export default {

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    // ROLE_ADMIN MENU FUNCTION
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes("ROLE_ADMIN");
      }
      return false;
    },

  },
  methods: {
    // LOGOUT
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
    checkToken() {
      if (this.currentUser) {
        const getUser = JSON.parse(localStorage.getItem('user'));
        const getToken = getUser.accessToken;

        if (getToken) {
          const decodedToken = jwtDecode(getToken);
          const expirationTime = decodedToken.exp * 1000; // 토큰 만료 시간
          const currentTime = Date.now(); // 현재 시간
          if (currentTime > expirationTime) {
            // 토큰이 만료된 경우 로그아웃 처리
            this.logout();
          }
        } else {
          // 토큰이 없는 경우 로그인 페이지로
          this.$router.push("/login");
        }
      }


    }

  },

  created() {
    this.checkToken();
  }

}
</script>

<style>

</style>