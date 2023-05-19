<!--
route : board/{id}
게시글 상세조회 페이지
게시글 / 댓글 컴포넌트 분리
-->
<template>

  <!--  ROOT DIV START-->
  <div>
    <!--  BOARD DETAIL DIV START-->
    <!--    currentBoard / board 가 존재할 때 렌더링 -->
    <div v-if="currentBoard">

      <!--      BoardArea START -->
      <div class="boardArea">
        <table class="table">
          <!--          BOARD DETAIL HEADLINE -->
          <thead>
          <tr class="myLiner">
            <th class="text-center nonBorder"> 제목</th>
            <td class="nonBorder" colspan="5"> {{ currentBoard.title }}</td>
          </tr>
          </thead>
          <!--BOARD DETAIL BODY-->
          <tbody>
          <tr>
            <th class="text-center nonBorder">작성자</th>
            <td> {{ currentBoard.writer.nickname }}</td>
            <th class="text-center nonBorder">작성일시</th>
            <td> {{ currentBoard.insertTime }}</td>
            <th class="text-center nonBorder">조회수</th>
            <td> {{ currentBoard.viewcnt }}</td>
          </tr>
          </tbody>
        </table>

        <!--        contentArea  -->
        <div class="contentArea nonBorder">
          <!--          <pre>{{ currentBoard.content }}</pre>-->
          <!--          <div v-html="currentBoard.content"></div>-->
          <ckeditor
              :editor="viewer"
              v-model="currentBoard.content"
              :config="viewerConfig"
              disabled
          >

          </ckeditor>

          <!--          최초 등록이 아닌 글 수정(updateTime) 발생시 본문에 수정시간을 강제로 추가 -->
          <p v-if="currentBoard.updateTime !== null">
            <b><br><small><em>이 게시글은
              <mark>{{ currentBoard.updateTime }}</mark>
              에 수정되었습니다.</em></small></b>
          </p>
        </div>
        <!--        {{ currentBoard.content }}-->
        <!--        버튼 영역 목록 / 수정&삭제(글쓴이===로그인유져) -->
        <div class="d-flex justify-content-end" id="boardBtnArea">
          <router-link to="/board" class="btn btn-secondary ms-3 mt-3">목록</router-link>
          <button
              type="submit"
              class="ms-3 mt-3 btn btn-success"
              @click="updateBoard"
              id="updateBtn"
              v-if="checkWriter()"
          > 수정
          </button>
          <button v-if="checkWriter()" id="delBtn"
                  class="mt-3 ms-3 btn btn-danger" @click="showBoardDelete">삭제
          </button>
        </div>
        <!--        FIXME : 추후 DIV에 v-if=checkWriter()를 통해 관리 할 필요 있음 -->
      </div>
      <!--   BoardArea Close -->

      <!--    RepliesArea Start-->
      <div class="repliesArea">
        <!--        댓글은 컴포넌트를 이용해 컨트롤 -->
        <replyList :boardId="currentBoard.id" :writerId="currentBoard.writer.id"/>
      </div>

      <!--    RepliesArea Close-->
    </div>


    <!--  BOARD DETAIL DIV START CLOSE -->

    <!--    currentBoard가 없거나 잘못된 접근-->
    <!--    FIXME : 잘못된 접근(삭제된 글 or 존재하지 않는 id로 접근에 대한 route 필요. -->
    <div v-else>
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ReplyList from "@/components/reply/ReplyList.vue";
import BoardDataService from "../../services/BoardDataService";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


export default {
  data() {
    return {
      currentBoard: null,
      message: "",
      boxTitle: '',
      selectModal: '',

      // CKEditor Options
      viewer: ClassicEditor,
      viewerConfig:
          {
            toolbar : null,
            minHeight : '500px',

          }
    };
  },

  components: {
    ReplyList,
  },

  methods: {
    // 게시글 단건 조회
    getBoard(id) {
      BoardDataService.getBoard(id)
          .then(response => {

            if(response.status === 204)
            {
              alert("존재하지 않는 게시물입니다.");
              this.$router.push("/board");

            }
            this.currentBoard = response.data;

          })
          .catch(e => {
            console.log(e);
          });
    },
    // 게시글 삭제 통신
    deleteBoard() {
      // 게시글의 id와 현재 로그인한 유져를 전송
      BoardDataService.deleteBoard(this.currentBoard.id, this.currentUser)
          .then(() => {
            this.$router.push("/board");
          })
          .catch(e => {
            console.log(e);
          });
    },
    // 게시글 수정 -> store(공유저장소) 이용
    updateBoard() {
      this.$store.commit('setCurrentBoard', this.currentBoard);
      this.$router.push({
        path: "/add-board/" + this.currentBoard.id
      });
    },
    // 글쓴이 = 현재 로그인 사용자 여부 확인
    checkWriter() {
      if (this.currentBoard && this.currentUser) {
        return this.currentBoard.writer.id === this.currentUser.id;
      }
      return false;
    },
    // 게시글 삭제 여부 모달 함수
    showBoardDelete() {
      this.selectModal = ''
      this.boxTitle = this.currentBoard.title;
      this.$bvModal.msgBoxConfirm('[' + this.boxTitle + '] 을 삭제하시겠습니까? ', {
        title: '게시글 삭제',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: '삭제',
        cancelTitle: '취소',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
          .then(value => {
            this.selectModal = value;
            if (this.selectModal === true) {
              this.deleteBoard();
            }
          })
          .catch(e => {
            console.log(e);
          })
    },
  },

  mounted() {
    this.message = "";
    this.getBoard(this.$route.params.id);

  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

};
</script>

<style scoped lang="scss">
@import "@/assets/css/BoardDetail.css";

</style>
