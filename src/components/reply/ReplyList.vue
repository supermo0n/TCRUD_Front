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

      <table class="table">
        <tbody :id="`reply`+reply.id">
        <tr class="align-content-center">
          <th class="usertab text-center">
            {{ reply.writer.nickname }}
            <small class="text-center text-danger fw-light" v-if="boardWritersCheck(reply.writer.id)"> [작성자] </small>
          </th>

          <td class="contenttab" rowspan="2"> {{ reply.content }}</td>
          <td class="text-center" v-if="checkWriter(reply.writer.id)">
            <button type="button" class="btn btn-secondary btn-sm" @click="showModal(reply)">수정</button>

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
          </td>
        </tr>
        <tr class="text-center">
          <td class="usertab"> {{ reply.insertTime }}</td>
          <td class="buttontab">
            <button class="btn btn-danger btn-sm" v-if="checkWriter(reply.writer.id)" @click="deleteReply(reply)">삭제
            </button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>

    <!--      TODO : Reply Pagenation-->
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

    <span></span>

    <!--      TODO : Reply ADD-->
    <div class="d-flex justify-content-center" v-if="currentUser">
      <form class="replyboxarea">
        <textarea class="replyabox" v-model="content"></textarea>
        <button v-if="content.length > 0" class="replyadd" @click.prevent="saveReply()">작성</button>
        <button v-else class="replyadd" disabled>작성</button>
      </form>
    </div>
  </div>

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
      required: false
    }
  },

  methods: {

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
      if (this.writerId == id) {
        return true;
      }
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

.myreply {
  background-color: #f3f6f4
}

.replyBar {
  width: 92%;
  height: 40px;
  background-color: #F3F3F3;
  margin: 0 auto;
}

.replyboxarea {
  margin-bottom: 50px;
}

.usertab {
  width: 20%;
}

.buttontab {
  width: 10%
}

.contenttab {
  width: 72%;
  padding-left: 50px;
}

tr {
  margin-bottom: 50px;
}

table, th, td {
  border: none
}

/* 댓글 등록 TEXTAREA*/
.replyabox {
  width: 800px;
  height: 100px;
  float: left;
  border: 0.5px solid lightgray
}

/* 댓글 등록 버튼 */
.replyadd {
  width: 100px;
  height: 100px;
  float: left;
  border: 0.5px solid lightgray;
}


</style>