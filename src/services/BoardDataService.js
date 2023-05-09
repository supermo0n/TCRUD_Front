
import http from "../http-common";

class BoardDataService {

    // 게시판 리스트 출력(페이징)
    getAllBoard(searchSelect, searchKeyword, page, size) {
        return http.get(`/board?searchSelect=${searchSelect}&searchKeyword=${searchKeyword}&page=${page}&size=${size}`);
    }

    // 게시글 단건 조회
    getBoard(boardid) {
        return http.get(`/board/${boardid}`)
    }

    // 게시글 생성
    createBoard(data, user) {
        return http.post("/board/add", data, {
            headers: {
                Authorization: "Bearer " + user.accessToken
            }
        });
    }

    // 게시글 수정
    updateBoard(boardid, data, user) {
        return http.put(`/board/${boardid}`, data, {
            headers: {
                Authorization: "Bearer " + user.accessToken
            }
        });
    }

    // 게시글 삭제
    deleteBoard(boardid, user) {
        return http.delete(`/board/${boardid}`, {
            headers: {
                Authorization: "Bearer " + user.accessToken
            }
        });
    }

    // 댓글 가져오기 페이징
    getReply(boardid, page){
        return http.get(`/board/${boardid}/reply?page=${page}`);
    }

    // 댓글 등록
    createReply(boardid, data, user)
    {
        return http.post(`/board/${boardid}/reply`, data, {
            headers: {
        Authorization: "Bearer " + user.accessToken }
    });
    }

    // 댓글 수정
    updateReply(boardid, replyid, data, user) {
        return http.put(`/board/${boardid}/reply/${replyid}`, data, {
            headers: {
                Authorization: "Bearer " + user.accessToken
            }
        });
    }

    // 댓글 삭제
    deleteReply(boardid, replyid, user) {
        return http.delete(`/board/${boardid}/reply/${replyid}`, {
            headers: {
                Authorization: "Bearer " + user.accessToken
            }
        });
    }


}

export default new BoardDataService();