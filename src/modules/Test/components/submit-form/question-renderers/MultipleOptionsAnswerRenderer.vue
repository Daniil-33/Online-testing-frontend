<template>
	<div class="w-100 d-flex flex-column">
		<template
			v-for="option in options"
			:key="option.id"
		>
			<template v-if="option.isCustomAnswer">
				<div class="d-flex align-items-center">
					<v-checkbox-btn
						class="pr-2"
						color="primary"
						:disabled="isViewingAnswer"
						:label="option.text"
						:value="option.id"
						:model-value="modelValue.selected"
						@update:model-value="setValue(option.id)"
					></v-checkbox-btn>

					<v-text-field
						label=""
						variant="underlined"
						color="primary"
						:model-value="modelValue.customAnswerText"
						@update:model-value="setCustomAnswerText($event)"
					></v-text-field>
				</div>
			</template>
			<template v-else>
				<v-checkbox-btn
					class="pr-2"
					color="primary"
					:disabled="isViewingAnswer"
					:label="option.text"
					:value="option.id"
					:model-value="modelValue.selected"
					@update:model-value="setValue(option.id)"
				></v-checkbox-btn>
			</template>
		</template>
	</div>
</template>
<script>
import { onBeforeMount, ref, computed } from 'vue'

export default {
	name: 'MultipleOptionsAnswerRenderer',
	props: {
		modelValue: {
			type: Array,
			default: () => []
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
			return props.modelValue.selected.length > 0
		})

		const isAnswered = () => {
			touchedByValidator.value = true
			return isAnswerFilled.value
		}

		const makeModelValueEmptyStructure = () => {
			return {
				selected: [],
				customAnswerText: '',
			}
		}

		const setValue = (optionId) => {
			const currentValue = props.modelValue.selected

			const newValue = currentValue.includes(optionId)
				? currentValue.filter((id) => id !== optionId)
				: [...currentValue, optionId]

			updateModelValue({
				...props.modelValue,
				selected: newValue,
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
			isAnswered
		}
	}
}
</script>