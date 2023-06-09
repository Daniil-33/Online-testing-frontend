<template>
	<v-radio-group
		:model-value="modelValue.selected"
		@update:model-value="setValue"
	>
		<template
			v-for="option in options"
			:key="option.id"
		>
			<template v-if="option.isCustomAnswer">
				<div class="d-flex align-items-center">
					<v-radio
						inline
						color="primary"
						:disabled="isViewingAnswer"
						:value="option.id"
						:label="option.text"
					></v-radio>
					<v-text-field
						label=""
						hide-details
						variant="underlined"
						color="primary"
						:model-value="modelValue.customAnswerText"
						@update:model-value="setCustomAnswerText($event)"
					></v-text-field>
				</div>
			</template>
			<template v-else>
				<v-radio
					color="primary"
					:disabled="isViewingAnswer"
					:value="option.id"
					:label="option.text"
				></v-radio>
			</template>
		</template>
	</v-radio-group>
</template>
<script>
import { onBeforeMount } from 'vue'

export default {
	name: 'SingleOptionAnswerRenderer',
	props: {
		modelValue: {
			type: String,
			default: () => ''
		},
		options: {
			type: Object,
			default: () => ({}),
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
		const touchedByValidator = ref(false)
		const requireError = computed(() => {
			return touchedByValidator.value && !isAnswerFilled.value
		})

		const isAnswerFilled = computed(() => {
			return props.modelValue.selected !== ''
		})

		const isAnswered = () => {
			touchedByValidator.value = true
			return isAnswerFilled.value
		}

		const makeModelValueEmptyStructure = () => {
			return {
				selected: '',
				customAnswerText: '',
			}
		}

		const setValue = (optionId) => {
			updateModelValue({
				...props.modelValue,
				selected: optionId,
			})
		}

		const updateModelValue = (value) => {
			emit('update:modelValue', value)
		}

		const setCustomAnswerText = (value) => {
			updateModelValue({
				...props.modelValue,
				customAnswerText: value,
			})
		}

		onBeforeMount(() => {
			updateModelValue(makeModelValueEmptyStructure())
		})

		return {
			setValue,
			setCustomAnswerText,
			isAnswered,
		}
	}
}
</script>