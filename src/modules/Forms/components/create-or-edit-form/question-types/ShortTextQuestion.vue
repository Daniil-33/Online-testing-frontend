<template>
	<v-text-field
		label="Коротка відповідь"
		variant="underlined"
		color="primary"
		:disabled="true"
	></v-text-field>

	<div
		v-if="showAnswers"
		class="mt-2"
	>
		<p class="text-body"><span class="right-answers-text">Відповіді</span>: {{ answers }}</p>
	</div>
</template>
<script>
import { computed } from 'vue'

export default {
	name: 'ShortTextQuestion',
	props: {
		rightAnswers: {
			type: Object,
			default: () => ({})
		}
	},
	emits: {
		'update:modelValue': null,
	},
	setup(props) {
		const showAnswers = computed(() => !!(props.rightAnswers?.options || []).filter(({ text }) => text).length)
		const answers = computed(() => (props.rightAnswers?.options || []).map(({ text }) => text || '').filter(v => v).join(', '))

		return {
			showAnswers,
			answers
		}
	}
}
</script>
<style>
	.right-answers-text {
		color: #4caf50;
	}
</style>