<template>

  <!--  ROOT DIV START-->
  <div class="container">

    <!--    BOARD LIST DIV START-->
    <div id="boardlist">

      <!--    BOARD DETAIL START-->
      <table class="table table-hover">
        <!--      BOARD DETAIL HEAD START -->
        <thead class="table-dark">
        <tr>
          <th class="text-center col-1">글번호</th>
          <th class="text-center col-6">제목</th>
          <th class="text-center col-2">작성자</th>
          <th class="text-center col-2">작성일시</th>
          <th class="text-center col-1">조회수</th>
        </tr>
        </thead>
        <!--      BOARD DETAIL HEAD CLOSE-->
        <!--      BOARD DETAIL CONTENT START -->
        <tbody v-for="(data, index) in boards" :key="index">
        <tr>
          <td class="text-center">{{ data.id }}</td>
          <td class="text-start">
            <router-link :to="'/board/' + data.id">{{ data.title }}
              <small class="text-muted ms-2" v-if="data.replycnt != 0"> [{{ data.replycnt }}]</small>
            </router-link>
          </td>
          <td class="text-center">{{ data.writer.nickname }}</td>
          <td class="text-center">{{ data.insertTime }}</td>
          <td class="text-center">{{ data.viewcnt }}</td>
        </tr>
        </tbody>
        <!--      BOARD DETAIL CONTENT CLOSE-->
      </table>
      <!--    BOARD DETAIL CLOSE-->
    </div>
    <!--    BOARD LIST DIV CLOSE-->

    <!-- BOARD LIST BOTTOM DIV START-->
    <div class="boardFooter">
      <!--      PAGINATION DIV START-->
      <div>
        <b-pagination
            class="float-start"
            v-model="page"
            :total-rows="count"
            :per-page="pageSize"
            prev-text="이전"
            next-text="다음"
            @change="handlePageChange"
        >
          <!--      [글쓰기] BUTTON -->
        </b-pagination>
        <router-link class="btn btn-dark float-end text-white" to="/add-board"
        >글쓰기
        </router-link>
      </div>
      <!--      PAGINATION DIV CLOSE-->

      <!--      SEARCH OPTION DIV START-->
      <div class="row-md-12 align-content-center">
        <!--    SEARCH SELECT BOX START-->
        <div class="input-group">
          <div class="col-3"></div>
          <div class="col-1.5">
            <select class="form-select" v-model="searchSelect">
              <option
                  v-for="(item, index) in selectList"
                  :key="index"
                  :value="item.value"
              >{{ item.name }}
              </option
              >
            </select>
          </div>

          <!--      searchKeyword FORM START -->
          <div class="col-3">
            <input
                type="text"
                class="form-control"
                placeholder="검색어 입력"
                v-model="searchKeyword"
            />
          </div>
          <!--      searchKeyword FORM CLOSE -->

          <!--      SEARCH BUTTON START -->
          <div class="input-group-append col-1">
            <button
                v-if="searchSelect.length > 0 && searchKeyword.length > 0"
                class="btn btn-outline-primary"
                type="button"
                @click="
              page = 1;
              retrieveBoard();
            "
            >
              Search
            </button>
            <button v-else class="btn btn-outline-secondary" disabled> Search</button>
          </div>
          <!--      SEARCH BUTTON CLOSE -->
        </div>
      </div>
      <!-- SEARCH OPTION DIV CLOSE -->
    </div>
    <!-- BOARD LIST BOTTOM DIV CLOSE-->
  </div>
  <!--  ROOT DIV CLOSE-->
</template>

<script>
import BoardDataService from "../../services/BoardDataService";

export default {
  data() {
    return {
      boards: [],
      selectList: [
        {name: "옵션", value: ""},
        {name: "제목", value: "title"},
        {name: "내용", value: "content"},
        {name: "제목+내용", value: "titleorcontent"},
        {name: "글쓴이ID", value: "username"},
        {name: "닉네임", value: "nickname"},
      ],
      searchKeyword: '',
      searchSelect: '',

      page: 1,
      count: 0,
      pageSize: 10, // 한 페이지당 ITEM 몇건?
    };
  },
  methods: {
    retrieveBoard() {
      BoardDataService.getAllBoard(
          this.searchSelect, // select box 선택된 값
          this.searchKeyword, // 검색어
          this.page - 1,
          this.pageSize
      )
          .then((response) => {
            const {boards, totalItems} = response.data;
            this.boards = boards;
            this.count = totalItems;
          })
          .catch((e) => {
            console.log(e);
          });
    },

    handlePageChange(value) {
      this.page = value; // 현재페이지 변경
      this.retrieveBoard();
    },
  },

  mounted() {
    this.retrieveBoard();
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
};
</script>

<style scoped>
.boardFooter {
  margin: 10px auto;
  width: 90%;
}

a {
  text-decoration: none;
  color: black;
}

td {
  border-bottom: lightgray;
}
</style>