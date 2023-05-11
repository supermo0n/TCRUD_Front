<template>

  <!--  ROOT DIV START-->
  <div class="container">

    <!--    PROFILE AREA DIV START-->
    <div class="myProfile">
      <header class="jumbotron">
        <h3>
          <strong>{{ currentUser.username }}</strong> 프로필
        </h3>
      </header>
      <p>
        <strong>닉네임:</strong>
        {{ currentUser.nickname }}
      </p>
      <p>
        <strong>이메일:</strong>
        {{ currentUser.email }}
      </p>
    </div>
    <!--    PROFILE AREA DIV CLOSE-->

    <!--    PROFILE UPDATE DIV START-->
    <div class="profileButton">

      <!--      [회원정보 수정하기] BUTTON START -->
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#firstModal"
              @click="clearForm()" v-show="!matchPwd">
        회원정보 수정하기
      </button>
      <!--      [회원정보 수정하기] BUTTON CLOSE -->

      <!-- PASSWORD MATCH MODAL DIV START-->
      <div class="modal fade" id="firstModal" tabindex="-1" aria-labelledby="firstModalLabel" aria-hidden="true"
           v-show="!matchPwd">
        <!--        PWDMATCH MODAL AREA START - 화면 가운데 -->
        <div class="modal-dialog modal-dialog-centered">
          <!--          MODAL CONTENT START-->
          <div class="modal-content">
            <!--            MODAL HEADER START -->
            <div class="modal-header">
              <h5 class="modal-title" id="firstModalLabel">비밀번호 확인</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <!--            MODAL HEADER CLOSE-->
            <!--            MODAL BODY START-->
            <div class="modal-body">
              <form @submit.prevent>
                <label for="currentPassword">현재 비밀번호 : </label>
                <input type="password" id="currentPassword" v-model="currentPassword" class="pwdinputbox"
                       autocomplete="off"/>
              </form>
            </div>
            <!--            MODAL BODY CLOSE-->
            <!--            MODAL FOOTER START - BUTTON -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cancleMatch()" data-bs-dismiss="modal">취소</button>
              <button class="btn btn-primary" @click="checkPwd()">확인</button>
            </div>
            <!--            MODAL FOOTER CLOSE - BUTTON -->
          </div>
        </div>
        <!--        MODAL AREA CLOSE - 화면 가운데 -->
      </div>
      <!-- PASSWORD MATCH MODAL DIV CLOSE -->

      <!--      MODAL SUCCESS(matchPwd == true) DIV START -->
      <div class="successPwd" v-if="matchPwd">
        <h3>회원정보 수정메뉴</h3>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pwdModal"
                @click="clearPwdForm()">비밀번호 변경
        </button>

        <!--        PASSWORD UPDATE MODAL START -->
        <div class="modal fade" id="pwdModal" aria-hidden="true" aria-labelledby="pwdModalLabel" tabindex="-1"
             v-show="matchPwd && !pwdSuccess">
          <!--          PASSWORD UPDATE MODAL AREA START - 화면 가운데 -->
          <div class="modal-dialog modal-dialog-centered">
            <!--             PASSWORD UPDATE MODAL CONTENT START-->
            <div class="modal-content">
              <!--             PASSWORD UPDATE MODAL HEADER START -->
              <div class="modal-header">
                <h5 class="modal-title" id="pwdModalLabel">비밀번호 변경</h5>
              </div>
              <!--             PASSWORD UPDATE MODAL HEADER CLOSE -->
              <!--             PASSWORD UPDATE MODAL BODY START-->
              <div class="modal-body">
                <!--                newPASSWORD INPUT FORM START -->
                <form @submit.prevent>
                  <div class="form-group">
                    <input hidden id="userName" name="username" autocomplete="currentUser.username" value="">
                    <label for="newPassword">새로운 비밀번호</label>
                    <input type="password" id="newPassword" v-model="updatePassword" class="inputbox"
                           autocomplete="new-password"
                           @blur="passwordPattern.test(updatePassword)"
                           placeholder="6-20자, 영어 대/소문자, 숫자, !@#$%^ 만을 사용할 수 있습니다."
                    />
                    <span v-if="!passwordPattern.test(updatePassword)" class="text-danger"> 비밀번호 형식을 확인하세요. </span>
                    <span v-else class="text-success"> 비밀번호 형식을 충족합니다. </span>

                  </div>
                </form>
                <!--                newPASSWORD INPUT FORM CLOSE -->
              </div>
              <!--             PASSWORD UPDATE MODAL BODY CLOSE-->
              <!--             PASSWORD UPDATE MODAL FOOTER START-->
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="canclePwd()">취소</button>
                <button v-if="passwordPattern.test(updatePassword)" class="btn btn-primary" @click="updatePwd()">비밀번호 변경</button>
                <button v-else class="btn btn-primary" disabled>비밀번호 변경</button>
              </div>
              <!--              PASSWORD UPDATE MODAL FOOTER CLOSE -->
            </div>
            <!--             PASSWORD UPDATE MODAL CONTENT CLOSE-->
          </div>
          <!--          PASSWORD UPDATE MODAL AREA CLOSE - 화면 가운데 -->
        </div>
        <!--        PASSWORD UPDATE MODAL CLOSE -->

        <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#nickModal"
                @click="clearNickForm()">닉네임 변경
        </button>

        <!--        NICKNAME UPDATE MODAL START-->
        <div class="modal fade" id="nickModal" aria-hidden="true" aria-labelledby="nickModalLabel" tabindex="-1"
             v-show="matchPwd && !nickSuccess">
          <!--           NICKNAME UPDATE MODAL AREA START-->
          <div class="modal-dialog modal-dialog-centered">
            <!--            NICKNAME UPDATE MODAL CONTENT START-->
            <div class="modal-content">
              <!--              -->
              <div class="modal-header">
                <h5 class="modal-title" id="nickModalLabel">닉네임 변경</h5>
              </div>
              <div class="modal-body">
                현재 닉네임 : [ {{ currentUser.nickname }} ]
                <form @submit.prevent>
                  <label for="newNickname">새로운 닉네임</label>
                  <input type="text" id="newNickname" v-model="updateNickname" class="inputbox"
                         @blur="nicknameCheck()"
                         placeholder="닉네임은 한글, 영어 대/소문자, 숫자로만 3-10자 범위로 이루어져야 합니다."
                  />
                  <span v-if="duplicateCheckNickname" class="text-danger"> {{ this.message }} </span>
                  <span v-else class="text-success"> {{ this.message }} </span>

                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancleNickname()">취소
                </button>
                <button v-if="!duplicateCheckNickname"
                        class="btn btn-primary" @click="updateNick()">닉네임 변경</button>
                <button v-else class="btn btn-primary" disabled>닉네임 변경</button>
              </div>
            </div>
          </div>
        </div>
        <!--        닉네임 변경 모달 끝-->

        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#closeAccount">탈퇴하기</button>

        <!--        회원탈퇴 모달 시작-->
        <div class="modal fade" id="closeAccount" aria-hidden="true" aria-labelledby="closeAccountLabel" tabindex="-1"
             v-if="matchPwd">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="closeAccountLabel">회원탈퇴</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <b class="text-center"><span class="badge bg-danger">탈퇴하기</span> 버튼을 누르면 회원탈퇴가 진행됩니다.</b>
                <p class="text-end text-danger">계속 하시겠습니까?</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                <button class="btn btn-danger" @click="closeAccount()">탈퇴하기</button>
              </div>
            </div>
          </div>
        </div>
        <!--        회원탈퇴 모달 끝 -->

        <!--        matchPwd = false로 회원정보 수정 메뉴 disable-->
        <button type="button" class="btn btn-warning" @click="cancleMatch()">작업취소</button>


      </div>


    </div>
  </div>
  <!--  ROOT DIV CLOSE-->
</template>

<script>
import User from "../model/user";
import UserDataService from "@/services/UserDataService";

export default {
  data() {
    return {
      currentPassword: "",
      updatePassword: "",

      matchPwd: false, // 비밀번호 일치 여부

      pwdSuccess: false,
      duplicateCheckNickname:true,
      nickSuccess: false,

      updateNickname: "",

      user: new User(),

      message : "",

    }
  },
  methods: {

    closeAccount()
    {
      UserDataService.deleteUser(this.currentUser.id)
          .then(response => {
            console.log(response);

            if(response.status === 200)
            {
              alert("회원탈퇴 성공. 초기페이지로 이동합니다.");
              $('.modal').modal('hide');
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();
              this.$store.dispatch("auth/logout");
              this.$router.push("/");
            }
          })
    },
    nicknameCheck()
    {
      if(!this.nicknamePattern.test(this.updateNickname))
      {
        this.message = "닉네임 형식을 충족하지 않습니다.";
        this.duplicateCheckNickname = true;
      }
      else
      {
        UserDataService.checkNickname(this.updateNickname)
            .then(response => {
              if (response.data === true) {
                this.message = "중복된 닉네임입니다."
                this.duplicateCheckNickname = true;

              } else {
                this.message = "사용가능한 닉네임입니다."
                this.duplicateCheckNickname = false;
              }
            })
            .catch(e => {
                  console.log(e);
                }
            );
      }
    },

    clearForm() {
      this.currentPassword = "";
    },

    cancleNickname() {
      this.duplicateCheckNickname = true;
      this.updateNickname = "";
    },
    clearNickForm() {
      this.duplicateCheckNickname = true;
      this.nickSuccess = false;
    },

    updateNick() {

      let data = {
        username: this.currentUser.username,
        nickname: this.updateNickname,
        email: this.currentUser.email,
        password: this.currentPassword,
        changePwd: false,
      }
      UserDataService.updateNickname(data)
          .then((response) => {
            if (response.data.accessToken) {
              alert("닉네임 변경 성공");
              localStorage.setItem("user", JSON.stringify(response.data));
              this.updateNickname = "";
              this.nickSuccess = true;

              this.$router.go(0);
            }
            else {
              alert("닉네임 변경 실패");
              this.updateNickname = "";
            }
          })
          .catch(e => {
                console.log(e);
              }
          );
    },

    // 비밀번호 확인 초기화, currentPassword Form 초기화
    cancleMatch() {
      this.currentPassword = "";
      if(this.matchPwd === true)
      {
        this.matchPwd = false;
        this.$router.go(0);
      }
      else
      {
        this.matchPwd = false;
      }
    },

    checkPwd() {
      this.pwdSuccess = false;

      let data = {
        password: this.currentPassword
      }

      UserDataService.matchPassword(data)
          .then((response) => {
            if (response.data === true) {
              this.matchPwd = true;
              $('.modal').modal('hide');
              $('body').removeClass('modal-open');
              $('.modal-backdrop').remove();

            } else {
              alert("비밀번호가 일치하지 않습니다.")
              this.matchPwd = false;
              this.currentPassword = "";
            }
          })
          .catch((e) => {
            console.log(e);
          });
    },

    canclePwd() {
      this.updatePassword = "";
    },

    clearPwdForm() {
      this.pwdSuccess = false;
    },

    updatePwd() {
      if (this.matchPwd === true && this.updatePassword.length > 0) {
        let data = {
          username: this.currentUser.username,
          nickname: this.currentUser.nickname,
          email: this.currentUser.email,
          password: this.currentPassword,
          changePwd: true,
          updatePwd : this.updatePassword
        };

        console.log(data);

        UserDataService.updatePassword(data)
            .then((response) => {

              if (response.data.accessToken) {
                alert("비밀번호 변경 성공");
                this.matchPwd = false;
                this.updatePassword = "";
                this.pwdSuccess = true;

                $('.modal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                this.$router.go(0);

              } else {
                alert("비밀번호 변경 실패");
                this.matchPwd = false;
                this.updatePassword = "";
              }
            })
            .catch(e => {
                  console.log(e);
                }
            );
      }
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    passwordPattern() {
      return /^[a-zA-Z0-9!@#$%^]{6,20}$/;
    },
    nicknamePattern(){
      return /^[a-zA-Z0-9ㄱ-ㅎ가-힣]{3,10}$/;
    }
  },

  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
}
</script>

<style scoped>
@import "@/assets/css/Profile.css";
.modal.fade:not(.show) {  display: none;}

</style>
