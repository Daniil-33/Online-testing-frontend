<template>
	<template v-if="system">
		<v-icon v-bind="systemIconProps"></v-icon>
	</template>
	<template v-else>
		<div v-html="iconHelper[icon]"></div>
	</template>
</template>
<script>
import { computed } from 'vue';
import iconHelper from '@/helpers/iconHelper'

export default {
	name: 'VIconCustom',
	props: {
		icon: {
			type: String,
			required: true
		},
		system: {
			type: Boolean,
			default: false
		},
	},
	setup() {
		const systemIconProps = computed(() => {
			return {}
		});

		return {
			systemIconProps
		}
	}
}
</script>