<template>
	<div class="w-100">
		<v-textarea
			label="Detailed answer"
			variant="underlined"
			color="primary"
			:model-value="modelValue"
			:disabled="isViewingAnswer"
			@update:model-value="setValue"
		/>
	</div>
</template>
<script>
import { onBeforeMount, computed } from 'vue'

export default {
	name: 'DetailedTextAnswerRenderer',
	props: {
		modelValue: {
			type: String,
			default: () => ''
		},
		isViewingAnswer: {
			type: Boolean,
			default: () => false
		},
		isRightAnswered: {
			type: Boolean,
			default: () => false
		},
	},
	emits: {
		'update:modelValue': null,
	},
	expose: [ 'isAnswered' ],
	setup(props, { emit }) {
		const makeModelValueEmptyStructure = () => {
			return ''
		}

		const setValue = (text) => {
			updateModelValue(text)
		}

		const updateModelValue = (value) => {
			emit('update:modelValue', value)
		}

		onBeforeMount(() => {
			updateModelValue(makeModelValueEmptyStructure())
		})

		return {
			setValue,
		}
	}
}
</script>