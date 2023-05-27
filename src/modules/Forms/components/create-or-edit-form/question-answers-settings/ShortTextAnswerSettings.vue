<template>
	<v-row>
		<v-col cols="10">
			<p
				class="text-h5"
				:class="{ 'text-disabled': !title }"
			>
				{{ title || 'Назва питання' }}
			</p>
		</v-col>
		<v-col cols="2">
			<ui-number-field
				label="Max points"
				:model-value="points"
				@update:model-value="(points = $event, updateOptions())"
			>
			</ui-number-field>
		</v-col>

		<v-col cols="12">
			<div
				class="d-flex align-center"
				handle=".handle"
				v-for="(option, index) in options"
				:key="option.id"
			>
				<span>
					{{ index + 1 }}.
				</span>

				<v-text-field
					v-model="option.text"
					variant="underlined"
					color="primary"
					:value="option.isCustomAnswer ? 'Write your answer here...' : option.text"
					@change="updateOptions"
				></v-text-field>

				<v-icon
					v-if="options.length > 1"
					icon="mdi-close"
					@click="removeOption(index)"
				></v-icon>
			</div>

			<div class="d-flex align-center">
				<v-btn
					variant="plain"
					@click="addOption(false)"
				>
					Add option
				</v-btn>
			</div>
		</v-col>
	</v-row>
</template>
<script>
import { reactive, onMounted, ref, computed } from 'vue'

export default {
	name: 'SingleOptionsGridAnswerSettings',
	props: {
		title: {
			type: String,
			default: '',
		},
		content: {
			type: Object,
			default: () => ({})
		},
		answerSettings: {
			type: Object,
			default: () => ({})
		}
	},
	emits: {
		'update:answer-settings': null,
	},
	setup(props, { emit }) {
		const rightAnswers = computed(() => props.answerSettings || {})
		const options = reactive([])
		const points = ref(0)

		const updateOptions = () => {
			emit('update:answer-settings', {
				options: options,
				points: points.value,
			})
		}

		const addOption = () => {
			options.push({
				text: '',
				id: Math.random().toString(36).substr(2, 9),
			})

			updateOptions()
		}

		const removeOption = (index) => {
			options.splice(index, 1)

			updateOptions()
		}

		onMounted(() => {
			if (rightAnswers.value.points !== undefined && rightAnswers.value.points !== null) {
				points.value = rightAnswers.value.points
			}

			if (Array.isArray(rightAnswers.value.options)) {
				options.push(...rightAnswers.value.options)
			} else {
				addOption()
			}
		})

		return {
			options,
			points,
			addOption,
			removeOption,
			updateOptions
		}
	}
}
</script>
<style>
.checkbox-pseudo {
	width: 10px;
	height: 10px;

	border: 1px solid #000;
}

.lose-placeholder {
	min-width: 21px;
}
</style>