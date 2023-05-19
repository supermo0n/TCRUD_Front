import AuthService from "@/services/auth/auth.service";

const user = JSON.parse(localStorage.getItem('user'));

const  initialState = user? { status : { loggedIn: true }, user}
    : { status : { loggedIn: false }, user: null };

export const auth = {
    namespaced : true,

    state: initialState,

    mutations: {
        // 로그인 성공시
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        // 로그인 실패
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        // 로그아웃 실행
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        // 회원가입 성공
        registerSuccess(state) {
            state.status.loggedIn = false;
        },
        // 회원가입 실패
        registerFailure(state) {
            state.status.loggedIn = false;
        },
    },

    actions: {
        // 로그인
        login({commit}, user) {
            return AuthService.login(user)
                .then(user => {
                    commit('loginSuccess', user);
                    return Promise.resolve(user);
                })
                .catch(error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                })
        },
        // 로그아웃
        logout({commit}) {
            AuthService.logout();
            commit('logout');
        },
        // 회원가입
        register({commit}, user) {
            return AuthService.register(user)
                .then(response => {

                    if(response.data.answer === true)
                    {
                        commit('registerSuccess');
                        return Promise.resolve(response.data);
                    }
                    else
                    {
                        commit('registerFailure');
                        return Promise.reject(response.data.message);
                    }

                })
                .catch(error => {
                    commit('registerFailure');
                    return Promise.reject(error);
                })
        }
    }
};