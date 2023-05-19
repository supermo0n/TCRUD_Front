<template>
  <!--  TODO : ROOT DIV-->
  <div class="container">

    <!--    TODO : Reply LIST -->

    <!--    {{ replies }}-->
    <div class="replyBar align-content-center">
      <div class="float-start"> 댓글 {{ this.count }}</div>
      <div class="float-end" role="button" @click="retrieveReply()">
        <font-awesome-icon icon="fa-solid fa-arrows-rotate"/>
        댓글 새로고침
      </div>
    </div>

    <div v-for="reply in replies" :key="reply.id">

      <div>

        <div :id="reply.id" class="d-flex replyObjectArea justify-content-center" v-if=" !isHiddenReply(reply)">


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
                              @click="updateReply(targetReplyId, targetReplyWriter)">수정
                      </button>
                      <button type="button" v-else class="btn btn-primary" disabled>수정</button>
                    </div>
                  </div>
                </div>
              </div>
              <!--            댓글 수정 MODEL CLOSE -->
              <button class="btn btn-danger btn-sm buttonTab" @click="confirmReplyDelete(reply)">삭제</button>
            </div>
            <!--            FIXME : 대댓글 입력창 추가 -->
            <button class="btn btn-primary btn-sm buttonTab" v-if="currentUser" @click="createChildReply(reply)">대댓글
            </button>
            <div class="d-flex justify-content-center" v-if="currentUser && reply.showChildReplyAddArea">
              <form class="replyAddBoxArea d-flex justify-content-center">
                <textarea class="replyAddBox" v-model="childReplyContent" placeholder="대댓글 작성창입니다."></textarea>
                <button v-if="childReplyContent.length > 0" class="replyAddBtn" @click.prevent="saveReply()">작성</button>
                <button v-else class="replyAddBtn" disabled>작성</button>
              </form>
            </div>
          </div>

          <div class="contentTab">
            <pre>{{ reply.content }}</pre>
            <p v-if="reply.updateTime !== null"><br><b><small><em>이 댓글은
              <mark>{{ reply.updateTime }}</mark>
              에 수정되었습니다.</em></small></b></p>
          </div>
        </div>

        <div :id="reply.id" class="d-flex replyObjectArea justify-content-center" v-else>
          <div class="userTab text-center">
            <p> </p>
          </div>
          <div class="contentTab">
            <p> 삭제된 댓글입니다. </p>
          </div>

        </div>


        <!--        ------------------------------- 대댓글 ------------------------------------------>
        <div v-for="childReply in flattenReplies(reply.children)" :key="childReply.id">

          <div class="d-flex justify-content-center childReply"
               :style="{ marginLeft: (childReply.depth * 40) + 30 + 'px' }"
               v-if="!isHiddenReply(childReply)">

            <div class="userTab text-center">
              {{ childReply.writer.nickname }}
              <span v-if="boardWritersCheck(childReply.writer.id)">
              <small class="text-center text-danger fw-light"> [작성자] </small>
            </span>
              <p>{{ childReply.insertTime }}</p>
              <!-- 수정 및 삭제 버튼 -->
              <div v-if="checkWriter(childReply.writer.id)">
                <button type="button" class="btn btn-secondary btn-sm buttonTab" @click="showModal(childReply)">수정
                </button>
                <button class="btn btn-danger btn-sm buttonTab" @click="confirmReplyDelete(childReply)">삭제</button>
              </div>
              <!--            FIXME : 대댓글 입력창 추가  -->
              <button class="btn btn-primary btn-sm buttonTab" v-if="currentUser" @click="createChildReply(childReply)">
                대댓글
              </button>
              <div class="d-flex justify-content-center" v-if="currentUser && childReply.showChildReplyAddArea">
                <form class="replyAddBoxArea d-flex justify-content-center">
                  <textarea class="replyAddBox" v-model="childReplyContent" placeholder="대댓글 작성창입니다."></textarea>
                  <button v-if="childReplyContent.length > 0" class="replyAddBtn" @click.prevent="saveReply()">작성</button>
                  <button v-else class="replyAddBtn" disabled>작성</button>
                </form>
              </div>
            </div>
            <div class="contentTab">
              <pre>{{ childReply.content }}</pre>
              <p v-if="childReply.updateTime !== null"><br><b><small><em>이 댓글은
                <mark>{{ childReply.updateTime }}</mark>
                에 수정되었습니다.</em></small></b></p>
            </div>
          </div>

          <div class="d-flex justify-content-center childReply"
               :style="{ marginLeft: (childReply.depth * 40) + 30 + 'px' }" v-else>
            <div class="userTab text-center">
              <p></p>
            </div>
            <div class="contentTab">
              <p> 삭제된 댓글입니다. </p>
            </div>
          </div>

        </div>

      </div>
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

export default {
  data() {
    return {
      replies: [],
      content: "",

      replyUpdateModal: false,
      replyContent: '',
      targetReplyId: '',
      targetReplyWriter: '',


      childTargetId: null, // 대댓글 작성 -> 부모(parent) ID
      childReplyContent: '', // 대댓글 작성 -> 대댓글 내용
      showChildReplyAddArea: false,

      count: 0,
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
    },
  },

  methods: {

    isHiddenReply(reply) {
      return reply.hidden === 'Y';
    },

    initializeReplies(replies) {
      const initializedReplies = replies.map((reply) => {
        reply.showChildReplyAddArea = false; // 댓글의 showChildReplyAddArea 초기화
        reply.children = this.initializeReplies(reply.children); // 대댓글의 showChildReplyAddArea 초기화 (재귀적으로 처리)
        return reply;
      });

      return initializedReplies;
    },
    // Depth 끝까지 탐색
    flattenReplies(replies) {
      let flattenedReplies = [];
      for (const reply of replies) {
        flattenedReplies.push(reply);
        if (reply.children && reply.children.length > 0) {
          flattenedReplies = flattenedReplies.concat(this.flattenReplies(reply.children));
        }
      }
      return flattenedReplies;
    },

    closeChildReplyInput(reply) {
      reply.showChildReplyAddArea = false;
      this.childReplyContent = "";
    },

    createChildReply(reply) {
      this.replies.forEach(r => {
        r.showChildReplyAddArea = false;
        r.children.forEach(c => c.showChildReplyAddArea = false);
      });

      this.childTargetId = reply.id;
      reply.showChildReplyAddArea = !reply.showChildReplyAddArea;
      if (!reply.showChildReplyAddArea) {
        this.childTargetId = null;
        this.childReplyContent = "";
      }
    },

    confirmReplyDelete(reply) {
      if (confirm("댓글을 삭제하시겠습니까?")) {
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
        content: '',
        parentReplyId: null,
      };

      if (this.childTargetId != null && this.childReplyContent.length > 0) {
        data.content = this.childReplyContent;
        data.parentReplyId = this.childTargetId;
      } else {
        data.content = this.content;
      }

      BoardDataService.createReply(this.boardId, data, this.currentUser)
          .then(() => {
            this.content = "";
            this.targetReplyId = null;
            this.childReplyContent = "";
            this.retrieveReply();
          })
          .catch((error) => {
            console.log(error);
          });
    },

    //  댓글  - LIST
    retrieveReply() {
      BoardDataService.getReply(this.$route.params.id)
          .then((response) => {
            this.replies = this.initializeReplies(response.data.replies);
            this.count = response.data.totalReply;
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
        this.targetReplyId = reply.id;
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
            this.targetReplyId = "";
            this.targetReplyWriter = "";
            this.retrieveReply();
          })
          .catch((error) => {
            console.log(error);
          });
    },

    deleteReply(reply) {
      this.targetReplyId = reply.id;
      this.targetReplyWriter = reply.writer.id;

      let deletesw = this.checkWriter(this.targetReplyWriter);

      if (!deletesw) {
        return;
      }

      this.targetReplyId = reply.id;
      this.targetReplyWriter = reply.writer.id;

      BoardDataService.deleteReply(reply.boardId, reply.id, this.currentUser)
          .then(() => {
            this.targetReplyId = "";
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