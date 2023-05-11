<template>

  <div class="container">

    <!--  BOARD DETAIL DIV START-->
    <div v-if="currentBoard">
      <div class="boardarea">
        <table class="table">
<!--          BOARD DETAIL HEADLINE -->
          <thead>
          <tr class="myliner">
            <th class="text-center nonborder"> 제목</th>
            <td class="nonborder" colspan="5"> {{ currentBoard.title }} </td>
          </tr>
          </thead>
<!--BOARD DETAIL BODY-->
          <tbody>
          <tr>
            <th class="text-center">작성자</th>
            <td> {{ currentBoard.writer.nickname }}</td>
            <th class="text-center">작성일시</th>
            <td> {{ currentBoard.insertTime }}</td>
            <th class="text-center">조회수</th>
            <td> {{ currentBoard.viewcnt }}</td>
          </tr>
          </tbody>
        </table>

        <div class="content-area">
          <pre>{{ currentBoard.content }}</pre>
<!--          최초 등록이 아닌 글 수정(updateTime) 발생시 본문에 수정시간을 강제로 추가 -->
          <p v-if="currentBoard.updateTime !== null"><b><br><small><em>이 게시글은<mark>{{ currentBoard.updateTime }}</mark>에 수정되었습니다.</em></small></b></p>
        </div>

        <div class="d-flex justify-content-end" id="boardBtnarea">
          <router-link to="/board" class="btn btn-secondary ms-3 mt-3">목록</router-link>
          <button
              type="submit"
              class="ms-3 mt-3 btn btn-success"
              @click="updateBoard"
              id="updateBtn"
              v-if="checkWriter()"
          > 수정
          </button>
          <button v-if="checkWriter()" id="delBtn" class="mt-3 ms-3 btn btn-danger" @click="showBoardDelete">삭제</button>

        </div>
      </div>
      <!--    div class BoardArea Close -->

      <!--    TODO : RepliesArea Start-->
      <div class="repliesarea">

<!--        FIXME : 230510 댓글영역 수정중 -->
<!--        <replyList v-if="currentUser" :boardId="currentBoard.id" :writerId="currentBoard.writer.id"/>-->
<!--        <replyList v-else :boardId="currentBoard.id" />-->

        <replyList :boardId="currentBoard.id" :writerId="currentBoard.writer.id"/>
      </div>
      <!--    RepliesArea Close-->
    </div>
    <!--  div class v-if CurrentBoard Close-->

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

export default {
  data() {
    return {
      currentBoard: null,
      message: "",
      boxTitle:'',
      selectModal:'',
    };
  },

  components:{
        ReplyList,
      },

  methods: {
    getBoard(id) {
      BoardDataService.getBoard(id)
          .then(response => {
            this.currentBoard = response.data;
          })
          .catch(e => {
            console.log(e);
          });
    },
    deleteBoard() {
      BoardDataService.deleteBoard(this.currentBoard.id, this.currentUser)
          .then(response => {
            this.$router.push("/board");
          })
          .catch(e => {
            console.log(e);
          });
    },
    updateBoard() {
      this.$store.commit('setCurrentBoard', this.currentBoard);
      this.$router.push({
        path: "/add-board/" + this.currentBoard.id
      });
    },


    checkWriter() {
      if (this.currentBoard && this.currentUser) {
        return this.currentBoard.writer.id === this.currentUser.id;
      }
      return false;
    },

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
            if(this.selectModal === true)
            {
              this.deleteBoard();
            }
          })
          .catch(e => {
            console.log(e);
          })
    }
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

<style>
edit-form { max-width: 300px; margin: auto;}
.nonborder { border : 0px;}
.boardarea { margin: 50px auto 25px;}
.myliner { line-height: 40px;}
#delBtn {  margin-left: 10px;}
.table {  width: 90%;  margin: 0 auto;}
th {  border: 0px;}
thead {  background-color: lightgrey;  border: 0px;}
tbody {  border-bottom: 0.5px solid lightgray;}
.content-area {  width: 85%;  margin: 0 auto;  padding-top: 30px;  padding-bottom: 30px;}

#boardBtnarea {
  border-bottom: 1px solid lightgray;
  border-top: 1px solid lightgray;
  width: 90%;
  margin: 5px auto;
  padding-bottom: 15px;
}

</style>
