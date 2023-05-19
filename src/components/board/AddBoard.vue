<template>

  <!--  ROOT DIV START-->
  <div class="boardForm">

    <!--  TEXT EDIT DIV START -->
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
              <input type="text"
                     v-model="board.title"
                     ref="subject"
                     placeholder="제목은 50자 까지 작성 가능합니다."
              />
              <!--                제목(Subject)의 길이는 50자(VARCAHR2 50char)로 제한-->
              <span v-if="board.title.length > 50" class="small text-danger"> 제목 길이 초과 </span>
              <span v-else class="small text-secondary">{{ board.title.length }} / 50</span>
            </td>
          </tr>

          <tr>

            <th class="text-center">내용</th>
            <!--기존 TEXTAREA-->
            <!-- <td><textarea v-model="board.content"></textarea></td>-->
            <!--              TODO : CKEDITOR 적용 -->
            <ckeditor
                :editor="editor"
                v-model="board.content"
                @Ready="onEditorReady"
            >
            </ckeditor>

          </tr>

        </table>
      </form>

    </div>
    <!--    TEXT EDIT DIV CLOSE-->

    <!--    BUTTON AREA DIV START-->
    <div class="buttonArea">

      <!--
            board.id가 없을 경우 최초등록[글쓰기] 버튼으로 노출
            등록 버튼은 제목길이(1-50자) && 내용이 1자 이상일때 활성화
            추후 변수나 watch 라이프 사이클로 개선해볼 필요
      -->
      <button
          v-if="board.id === null && board.title.length > 0 && board.title.length < 51 && board.content.length > 0"
          @click="saveBoard()"
          class="btn btn-primary"
      >
        글쓰기
      </button>

      <!--        board.id가 존재할 때 -> 수정작업 -->
      <button
          v-else-if="board.id != null && board.title.length > 0 && board.title.length < 51 && board.content.length > 0"
          @click="updateBoard()"
          class="btn btn-primary"
      >
        수정
      </button>

      <!--        제목과 본문길이를 충족하지 않은 상태에선 비활성화(dsiabled) 버튼 노출 -->
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

      <!--        글쓰기 취소시 -> 이전페이지로 이동(route)-->
      <button @click="cancelWrite()" class="btn btn-secondary btnpd"> 돌아가기</button>

    </div>
    <!--    BUTTON AREA DIV CLOSE-->


  </div>
  <!--  ROOT DIV CLOSE-->
</template>

<script>

import BoardDataService from "../../services/BoardDataService";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {

  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem("user")),

      board: {
        id: this.$route.params.id !== undefined ? this.$route.params.id : null,
        title: "",
        content: "",
        user: {},
      },

      name: 'add-board',
      props: {
        currentBoard: Object,
      },

      editor: ClassicEditor,
      editorConfig:
          {
            minHeight: '500px',
            maxHeight: '500px'
          }

    };
  },

  methods: {
    onEditorReady(editor) {
      editor.ui.view.editable.extendTemplate({
        attributes: {
          style: {
            minHeight: '500px', // 최소 높이 설정
            maxHeight: '500px;'
          }
        }
      });
    },

    // 글쓰기
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
    // 글 수정 -> 공유저장소(store)를 통해 board객체 전달
    updateBoard() {
      BoardDataService.updateBoard(this.board.id, this.board, this.currentUser)
          .then(() => {
            this.$store.commit('resetCurrentBoard');
            this.$router.push("/board/" + this.board.id)
          })
          .catch(e => {
            console.log(e);
          });
    },
    // 취소 - 이전페이지로 돌아가기
    cancelWrite() {
      this.$router.go(-1);
    },
  },

  created() {
    // url 파라메터에 id가 존재할 경우
    if (this.$route.params.id !== undefined) {
      // store(공유저장소)에 저장된 board 객체를 가져오기
      const currentBoard = this.$store.state.currentBoard;
      // board 객체 존재하면
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

<style scoped lang="scss">
@import "@/assets/css/addBoard.css";

</style>