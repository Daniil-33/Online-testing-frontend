import ApiService from '../api/';
import getRequestServiceInstance from '@/services/requestService.js';
import { clientStorageLocal } from '@/helpers/clientStorageHelper';
import { LOCAL_STORAGE_AUTH_ACCESS_TOKEN_KEY, LOCAL_STORAGE_AUTH_REFRESH_TOKEN_KEY } from '@/config/clientStorageKeys';

import { useAuthStore } from '../store/authStore';
import { useApplicationStore } from '@/stores/applicationStore';

export default function useAuth() {
	const { setAuthAccessToken, setAuthRefreshToken, setCurrentUser } = useAuthStore();
	const { addErrorNotify, addSuccessNotify } = useApplicationStore();

	const tryAutoLogin = () => {
		const accessToken = clientStorageLocal.get(LOCAL_STORAGE_AUTH_ACCESS_TOKEN_KEY);

		if (accessToken) {
			setAuthAccessToken(accessToken);

			const globalRequestService = getRequestServiceInstance();
			globalRequestService.setAccessToken(accessToken)


			return login({});
		}
	}

	const login = async ({ email, password }) => {
		ApiService.request('login', {
			queryParams: {
				email,
				password
			}
		})
			.then(
				({ token,  user }) => {
					saveAuthTokens(token);
					setCurrentUser(user);
					addSuccessNotify({
						text: 'Login successful.'
					});
				},
				(error) => addErrorNotify({
					text: error?.message || 'Login failed, please try again later.'
				})
			)
	};

	const register = async ({ name, email, password }) => {
		ApiService.request('register', {
			data: {
				name,
				email,
				password
			}
		})
			.then(
				({ token, user }) => {
					saveAuthTokens(token);
					addSuccessNotify({
						text: 'Register successful.'
					});
				},
				(error) => addErrorNotify({
					text: error?.message || 'Register failed, please try again later.'
				})
			)
	};

	const logout = () => {
		clientStorageLocal.remove(LOCAL_STORAGE_AUTH_ACCESS_TOKEN_KEY);
		// clientStorageLocal.remove(LOCAL_STORAGE_AUTH_REFRESH_TOKEN_KEY);

		setAuthAccessToken(null);
		// setAuthRefreshToken(null);
	};

	// const saveAuthTokens = ({ accessToken, refreshToken }) => {
	// 	clientStorageLocal.add(LOCAL_STORAGE_AUTH_ACCESS_TOKEN_KEY, accessToken);
	// 	clientStorageLocal.add(LOCAL_STORAGE_AUTH_REFRESH_TOKEN_KEY, refreshToken);

	// 	setAuthAccessToken(accessToken);
	// 	setAuthRefreshToken(refreshToken);
	// };
	const saveAuthTokens = (token) => {
		clientStorageLocal.add(LOCAL_STORAGE_AUTH_ACCESS_TOKEN_KEY, token);

		const globalRequestService = getRequestServiceInstance();
		globalRequestService.setAccessToken(token)

		setAuthAccessToken(token);
	};

	return {
		tryAutoLogin,
		register,
		login,
		logout
	}
}