<template>

  <div class="boardForm">

    <!-- ADDBOARD FORM START -->
    <div>
      <div class="writeForm">
        <form>
          <table class="boardForm">
            <colgroup>
              <col width="15%"/>
              <col width="*"/>
            </colgroup>
            <tr>
              <th class="text-center">제목</th>
              <td>
                <input type="text" v-model="board.title" ref="subject" placeholder="제목은 50자 까지 작성 가능합니다."/>
                <span v-if="board.title.length > 50" class="small text-danger"> 제목 길이 초과 </span>
                <span v-else class="small text-secondary">{{ board.title.length }} / 50</span>
              </td>
            </tr>
            <tr>
<!--              TODO : TOAST-UI-VUE-EDITOR 적용해보기 -->
              <th class="text-center">내용</th>
              <td><textarea v-model="board.content"></textarea></td>
            </tr>
          </table>
        </form>
      </div>

      <div class="buttonArea">
        <button
            v-if="board.id === null && board.title.length > 0 && board.content.length >0"
            @click="saveBoard()"
            class="btn btn-primary"
        >
          글쓰기
        </button>

        <button v-else-if="board.id != null && board.title.length > 0 && board.content.length >0"
                @click="updateBoard()"
                class="btn btn-primary"
        >
          수정
        </button>
        <button v-else-if="board.id === null"
                class="btn btn-primary"
                disabled
        >
          글쓰기
        </button>
        <button v-else-if="board.id != null"
                class="btn btn-primary"
                disabled
        >
          수정
        </button>
        <button @click="cancleClk()" class="btn btn-secondary btnpd"> 돌아가기</button>
      </div>

    </div>

  </div>

</template>

<script>
import BoardDataService from "../../services/BoardDataService";

export default {
  data() {
    return {
      board: {
        id: this.$route.params.id !== undefined ? this.$route.params.id : null,
        title: "",
        content: "",
        user: {}
      },

      boardContentLength: 0,

      name: 'add-board',
      props: {
        currentBoard: Object
      },

      currentUser: JSON.parse(localStorage.getItem("user")),
    };
  },
  methods: {
    saveBoard() {
      let data = {
        id: null,
        title: this.board.title,
        content: this.board.content,
        user: this.currentUser
      };

      BoardDataService.createBoard(data, this.currentUser)
          .then((response) => {
            this.$router.push("/board/" + response.data.id);
          })
          .catch((e) => {
            console.log(e);
          });
    },
    updateBoard() {
      BoardDataService.updateBoard(this.board.id, this.board, this.currentUser)
          .then(response => {
            this.$store.commit('resetCurrentBoard');
            this.$router.push("/board/" + this.board.id)
          })
          .catch(e => {
            console.log(e);
          });
    },

    cancleClk() {
      this.$router.go(-1);
    },
  },

  created() {
    if (this.$route.params.id !== undefined) {
      const currentBoard = this.$store.state.currentBoard;
      if (currentBoard) {
        this.board = currentBoard;
        this.title = currentBoard.title;
        this.content = currentBoard.content;
      } else {
        this.$router.push("/board/" + this.$route.params.id);
      }
    }
  },
}

</script>

<style lang="scss" scoped>
@import "../../assets/css/addBoard.css";

</style>