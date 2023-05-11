import http from "@/http-common";
import authHeader from "@/services/auth/auth-header";

class UserDataService {

    updatePassword(data) {
    return http.put('/auth/user/update',data, { headers: authHeader() });
  }

  updateNickname(data) {
    return http.put('/auth/user/update',data, { headers: authHeader() });
  }

  matchPassword(data)  {
    return http.post('/auth/matchpwd', data,  { headers: authHeader() });
  }

  checkNickname(keyword)  {
    return http.get(`/auth/check/nickname/${keyword}`,{ headers: authHeader() });
  }

    deleteUser(userId){
        return http.delete(`/auth/user/deletion/${userId}`,{ headers: authHeader() });
    }
}

export default new UserDataService();
