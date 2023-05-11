<template>
  <!--  TODO : ROOT DIV-->
  <div class="container">

    <!--    TODO : Reply LIST -->

    <div class="replyBar align-content-center">
      <div class="float-start"> 댓글 {{ this.count }}</div>
      <div class="float-end" role="button" @click="retrieveReply()">
        <font-awesome-icon icon="fa-solid fa-arrows-rotate"/>
        댓글 새로고침
      </div>
    </div>

    <div v-for="reply in replies" :key="reply.id">

      <div>
        <div :id="reply.id" class="d-flex replyObjectArea justify-content-center ">
          <div class="userTab text-center">
            {{ reply.writer.nickname }}
            <span v-if="boardWritersCheck(reply.writer.id)"><small
                class="text-center text-danger fw-light"> [작성자] </small></span>
            <p>{{ reply.insertTime }}</p>

            <div v-if="checkWriter(reply.writer.id)">
              <button type="button" class="btn btn-secondary btn-sm buttonTab" @click="showModal(reply)">수정</button>
              <!--            댓글 수정 MODAL START -->
              <div class="modal fade" id="replyUpdateModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                   aria-hidden="true" v-show="replyUpdateModal">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">댓글수정</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <textarea style="width:100%" v-model="replyContent"></textarea>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                      <button type="button" v-if="replyContent.length>0" class="btn btn-primary" data-bs-dismiss="modal"
                              @click="updateReply(targetReplyid, targetReplyWriter)">수정
                      </button>
                      <button type="button" v-else class="btn btn-primary" disabled>수정</button>
                    </div>
                  </div>
                </div>
              </div>
              <!--            댓글 수정 MODEL CLOSE -->
              <button class="btn btn-danger btn-sm buttonTab" @click="confirmReplyDelete(reply)" >삭제</button>
            </div>
          </div>

          <div class="contentTab">
            <pre>{{ reply.content }}</pre>
            <p v-if="reply.updateTime !== null"><br><b><small><em>이 댓글은<mark>{{ reply.updateTime }}</mark>에 수정되었습니다.</em></small></b></p>
          </div>

        </div>
      </div>

      <!--      TODO : Reply Pagenation-->

    </div>
    <div v-if="count > 5">
      <b-pagination
          class="d-flex justify-content-center"
          v-model="page"
          :total-rows="count"
          :per-page="pageSize"
          prev-text="◀"
          next-text="▶"
          @change="handlePageChange"
      >
      </b-pagination>
    </div>

    <!--      TODO : Reply ADD-->
    <div class="d-flex justify-content-center" v-if="currentUser">
      <form class="replyAddBoxArea d-flex justify-content-center">
        <textarea class="replyAddBox" v-model="content"></textarea>
        <button v-if="content.length > 0" class="replyAddBtn" @click.prevent="saveReply()">작성</button>
        <button v-else class="replyAddBtn" disabled>작성</button>
      </form>
    </div>

  </div>
  <!--  ROOT DIV(CONTAINER) CLOSE-->
</template>

<script>

import BoardDataService from "@/services/BoardDataService";
import boardDataService from "@/services/BoardDataService";

export default {
  data() {
    return {
      replies: [],
      content: "",

      replyUpdateModal: false,
      replyContent: '',
      targetReplyid: '',
      targetReplyWriter: '',

      page: 1,
      count: 0,
      pageSize: 5,
    };
  },

  props: {
    boardId: {
      type: Number,
      required: true
    },
    writerId: {
      type: Number,
      required: true
    }
  },

  methods: {

    confirmReplyDelete(reply)
    {
      if (confirm("댓글을 삭제하시겠습니까?"))
      {
        this.deleteReply(reply);
      }
    },

    saveReply() {
      // 만약, 로그인 상태가 아니라면.
      if (!this.currentUser) {
        return;
      }

      let data = {
        boardId: parseInt(this.boardId),
        userId: parseInt(this.currentUser.id),
        content: this.content
      };

      BoardDataService.createReply(this.boardId, data, this.currentUser)
          .then(() => {
            this.content = "";
            this.retrieveReply();
          })
          .catch((error) => {
            console.log(error);
          });
    },
    retrieveReply() {
      BoardDataService.getReply(this.$route.params.id, this.page - 1)
          .then((response) => {
            const {replies, totalItems} = response.data;
            this.replies = replies;
            this.count = totalItems;
          })
          .catch((e) => {
            console.log(e);
          })
    },

    handlePageChange(value) {
      this.page = value;
      this.retrieveReply();
    },

    // 게시판 글 작성자 == 댓글 작성자 -> [글쓴이] 체크용
    boardWritersCheck(id) {
      return id === this.writerId;
    },
    // 댓글 작성자 == 현재 로그인 사용자 일치여부 확인
    checkWriter(rid) {
      if (this.currentUser) {
        if (rid === this.currentUser.id) {
          return true
        }
        return false;
      }
      return false;

    },

    showModal(reply) {
      this.$nextTick(() => {
        const modal = document.querySelector('#replyUpdateModal');
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        this.replyContent = reply.content;
        this.targetReplyid = reply.id;
        this.targetReplyWriter = reply.writer.id;
      });
    },

    hideModal() {
      this.replyUpdateModal = false
    },
    updateReply(replyid, replywriterid) {
      let updatesw = this.checkWriter(replywriterid);
      if (!updatesw) {
        return;
      }

      let data = {
        boardId: parseInt(this.boardId),
        replyId: parseInt(replyid),
        userId: parseInt(this.currentUser.id),
        content: this.replyContent
      };

      BoardDataService.updateReply(this.boardId, replyid, data, this.currentUser)
          .then(() => {
            this.content = "";
            this.targetReplyid = "";
            this.targetReplyWriter = "";
            this.retrieveReply();
          })
          .catch((error) => {
            console.log(error);
          });
    },

    deleteReply(reply) {
      this.targetReplyid = reply.id;
      this.targetReplyWriter = reply.writer.id;

      let deletesw = this.checkWriter(this.targetReplyWriter);

      if (!deletesw) {
        return;
      }

      this.targetReplyid = reply.id;
      this.targetReplyWriter = reply.writer.id;

      boardDataService.deleteReply(reply.boardId, reply.id, this.currentUser)
          .then(() => {
            this.targetReplyid = "";
            this.targetReplyWriter = "";
            this.retrieveReply();
          })
          .catch((error) => {
            console.log(error);
          });
    },


  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  created() {
    this.retrieveReply();
  },
  mounted() {
    this.replyUpdateModal = document.querySelector('[data-bs-target="#replyUpdateModal"]');
  }
};

</script>

<style>
@import "@/assets/css/ReplyList.css";


</style>