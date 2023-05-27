import Auth from './components/Auth.vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './store/authStore'

const useAuthModule = () => {
	const authStore = useAuthStore()
	const { currentUser, isAuth, isLoadingCurrentUser } = storeToRefs(authStore)

	return {
		isAuth,
		currentUser,
		isLoadingCurrentUser
	}
}

export {
	Auth,
	useAuthModule
}