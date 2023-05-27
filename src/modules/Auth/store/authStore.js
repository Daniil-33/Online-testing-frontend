import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		currentUser: null,
		accessToken: null,
		refreshToken: null,
		loadingCurrentUser: true
	}),
	actions: {
		setAuthAccessToken(token) {
			this.accessToken = token;
		},
		setAuthRefreshToken(token) {
			this.refreshToken = token;
		},
		setCurrentUser(user) {
			this.currentUser = user;
		},
		setLoadingCurrentUser(loading) {
			this.loadingCurrentUser = loading;
		},
	},
	getters: {
		isAuth: (state) => !!state.currentUser,
		isLoadingCurrentUser: (state) => state.loadingCurrentUser,
		getCurrentUser: (state) => state.currentUser,
	}
});