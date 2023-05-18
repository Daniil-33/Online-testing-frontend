<template>
	<div>
		<v-text-field
			label="Short answer"
			variant="underlined"
			color="primary"
			:disabled="isViewingAnswer"
			:model-value="modelValue"
			@update:model-value="setValue"
		></v-text-field>
	</div>
</template>
<script>
import { onBeforeMount, computed } from 'vue'

export default {
	name: 'ShortTextAnswerRenderer',
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
		const isAnswerFilled = computed(() => {
			return props.modelValue !== ''
		})

		const isAnswered = () => {
			touchedByValidator.value = true
			return isAnswerFilled.value
		}

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
			isAnswered,
		}
	}
}
</script>