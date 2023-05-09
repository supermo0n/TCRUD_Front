import http from "../../http-common";

class AuthService {
  // 로그인
  login(user) {
    let userData = {
      username: user.username,
      password: user.password,
    };

    return (
      http
        .post("/auth/signin", userData)
        .then((response) => {
          // 응답정보에서 토큰 있는지 체크
          if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }

          return response.data;
        })
    );
  }

  // 로그아웃
  logout() {
    localStorage.removeItem("user");
  }

  // 회원가입
  register(user) {
    let userData = {
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      password: user.password,  
    };
    return http.post('/auth/signup', userData);
  }
}

export default new AuthService();
