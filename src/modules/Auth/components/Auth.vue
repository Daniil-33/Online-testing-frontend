<template>
	<div class="h-100 w-100 d-flex align-center justify-center">
		<template v-if="isLoadingCurrentUser">
			<v-card class="w-100 h-100 d-flex align-center justify-center">
				<v-progress-circular
					indeterminate
					color="primary"
				></v-progress-circular>
			</v-card>
		</template>
		<div v-else class="auth bg-white rounded overflow-hidden">
			<v-tabs
				fixed-tabs
				rounded
				bg-color="primary"
				v-model="tab"
			>
				<v-tab
					v-for="tab in tabs"
					:key="tab.value"
					:value="tab.value"
				>
					{{ tab.title }}
				</v-tab>
			</v-tabs>

			<v-window v-model="tab">
				<v-window-item :value="tabs[0].value">
					<LoginForm />
				</v-window-item>

				<v-window-item :value="tabs[1].value">
					<RegisterForm />
				</v-window-item>
			</v-window>
		</div>
	</div>
</template>
<script>
import LoginForm from './forms/LoginForm.vue';
import RegisterForm from './forms/RegisterForm.vue';

import { ref, onBeforeMount } from 'vue'

import useAuth from '../composables/useAuth';
import { useAuthStore } from '../store/authStore';
import { storeToRefs } from 'pinia'

export default {
	name: 'Auth',
	components: {
		LoginForm,
		RegisterForm,
	},
	setup() {
		const tabs = [
			{
				title: 'Авторизація',
				value: 'login',
			},
			{
				title: 'Реєстрація',
				value: 'register',
			}
		];
		const tab = ref(tabs[0].value);

		const { isLoadingCurrentUser } = storeToRefs(useAuthStore());
		const { tryAutoLogin } = useAuth();

		onBeforeMount(() => {
			tryAutoLogin();
		});

		return {
			tabs,
			tab,
			isLoadingCurrentUser,
		}
	},
}
</script>

<style>
.auth {
	max-width: 500px;
	width: 100%;
}
</style>