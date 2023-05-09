import Vue from 'vue'
import Vuex from 'vuex'

import { auth } from "./auth.module.js";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth
  },
  // BoardDetail -> Add-Board/:id 간 데이터 공유위한 vuex
  state: {
    currentBoard: []
  },
  mutations: {
    setCurrentBoard(state, board) {
      state.currentBoard = board;
    },
    resetCurrentBoard(state) {
      state.currentBoard = [];
    }
  }
})
