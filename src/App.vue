<template>
	<v-app>
		<v-main>
			<component
				:is="layoutName"
			>
				<template v-if="!isAuth">
					<Auth />
				</template>
				<template v-else>
					<router-view />
				</template>
			</component>

			<NotificationProvider />
		</v-main>
	</v-app>
</template>
<script>
import { Auth, useAuthModule } from '@/modules/Auth/'

import DefaultLayout from './layouts/DefaultLayout.vue';
import EmptyLayout from './layouts/EmptyLayout.vue';

import NotificationProvider from '@/components/providers/NotificationProvider.vue'

import { computed } from 'vue';

export default {
	name: 'App',
	components: {
		Auth,
		DefaultLayout,
		EmptyLayout,
		NotificationProvider,
	},
	setup() {
		const { isAuth } = useAuthModule();

		const layoutName = computed(() => {
			return isAuth.value ? DefaultLayout : EmptyLayout;
		});

		return {
			isAuth,
			layoutName
		};
	}
}
</script>
<style lang="scss">
@import '@/assets/scss/global.scss';
html {
	overflow-y: hidden !important;
}
</style>
