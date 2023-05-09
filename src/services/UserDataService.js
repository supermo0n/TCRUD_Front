import http from "@/http-common";
import authHeader from "@/services/auth/auth-header";

class UserDataService {

  create(user) {
    let userData = {
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      role : [user.role]
    };
    console.log(userData);
    // return axios.post(API_URL + 'signup', userData);
    return http.post("/user", userData, { headers: authHeader() });
  }

  update(id, changePwd, user) {
    let userData = {
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      role: [user.role[0].rname],
      changePwd: changePwd,
    };

    return http.put(`/user/${id}`, userData, { headers: authHeader() });
  }

    // (12/30 추가) 비번 재설정 시 필요한 함수
    updatePassword(data) {
    return http.put('/auth/user/update',data, { headers: authHeader() });
  }

  updateNickname(data) {
    return http.put('/auth/user/update',data, { headers: authHeader() });
  }

  matchPassword(data)
  {
    return http.post('/auth/matchpwd', data,  { headers: authHeader() });
  }

  checkNickname(keyword)
  {
    return http.get(`/auth/check/nickname/${keyword}`,{ headers: authHeader() });
  }
}

export default new UserDataService();
