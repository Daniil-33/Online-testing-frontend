import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		currentUser: null,
		accessToken: null,
		refreshToken: null,
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
		}
	},
	getters: {
		isAuth: (state) => !!state.currentUser,
		getCurrentUser: (state) => state.currentUser,
	}
});