import ApiService from '../api/';
import getRequestServiceInstance from '@/services/requestService.js';
import { clientStorageLocal } from '@/helpers/clientStorageHelper';
import { LOCAL_STORAGE_AUTH_ACCESS_TOKEN_KEY } from '@/config/clientStorageKeys';

import { useAuthStore } from '../store/authStore';
import { useApplicationStore } from '@/stores/applicationStore';

import { reactive } from 'vue';

export default function useAuth() {
	const { setAuthAccessToken, setCurrentUser, setLoadingCurrentUser } = useAuthStore();
	const { addErrorNotify, addSuccessNotify } = useApplicationStore();

	const loadingFlags = reactive({
		isLogin: false,
		isRegister: false,
	})

	const tryAutoLogin = async () => {
		const accessToken = clientStorageLocal.get(LOCAL_STORAGE_AUTH_ACCESS_TOKEN_KEY);

		if (accessToken) {
			setLoadingCurrentUser(true);
			setAuthAccessToken(accessToken);

			const globalRequestService = getRequestServiceInstance();
			globalRequestService.setAccessToken(accessToken)

			try {
				await login({});
			} catch (error) {}

			setLoadingCurrentUser(false);
		} else {
			setLoadingCurrentUser(false);
		}
	}

	const login = async ({ email, password }) => {
		return new Promise((res, rej) => {
			loadingFlags.isLogin = true;

			ApiService.request('login', {
				queryParams: {
					email,
					password
				}
			})
				.then(({ token, user }) => {
					saveAuthTokens(token);
					setCurrentUser(user);
					addSuccessNotify({
						text: 'Авторизація успішна'
					});

					res(user);
				})
				.catch((error) => {
					addErrorNotify({
						text: error?.message || 'Авторизація не вдалася, спробуйте пізніше.'
					})

					rej(error);
				})
				.finally(() => {
					loadingFlags.isLogin = false;
				})
		})
	};

	const register = async ({ name, email, password }) => {
		return new Promise((res, rej) => {
			loadingFlags.isRegister = true;

			ApiService.request('register', {
				data: {
					name,
					email,
					password
				}
			})
				.then(({ token, user }) => {
					saveAuthTokens(token);
					addSuccessNotify({
						text: 'Регістрація успішна'
					});

					res(user);
				})
				.catch((error) => {
					addErrorNotify({
						text: error?.message || 'Регістрація не вдалася, спробуйте пізніше.'
					})

					rej(error);
				})
				.finally(() => {
					loadingFlags.isRegister = false;
				})
		})
	};

	const logout = () => {
		clientStorageLocal.remove(LOCAL_STORAGE_AUTH_ACCESS_TOKEN_KEY);

		setAuthAccessToken(null);
	};

	const saveAuthTokens = (token) => {
		clientStorageLocal.add(LOCAL_STORAGE_AUTH_ACCESS_TOKEN_KEY, token);

		const globalRequestService = getRequestServiceInstance();
		globalRequestService.setAccessToken(token)

		setAuthAccessToken(token);
	};

	return {
		loadingFlags,

		tryAutoLogin,
		register,
		login,
		logout
	}
}