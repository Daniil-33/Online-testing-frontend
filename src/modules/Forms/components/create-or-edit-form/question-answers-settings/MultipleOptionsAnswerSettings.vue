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
			<v-checkbox
				class="answer-check rounded"
				:color="rightOptions.includes(option.id) ? 'success' : 'primary'"
				hide-details
				v-for="option in options"
				v-model="rightOptions"
				:key="option.id"
				:value="option.id"
				:label="option.text || (option.isCustomAnswer && 'Напишіть власний варіант...' || '')"
				:class="{ 'bg-green-lighten-4': rightOptions.includes(option.id) }"
				@update:model-value="updateOptions()"
			></v-checkbox>
		</v-col>
	</v-row>
</template>
<script>
import { ref, computed, onMounted } from 'vue'

export default {
	name: 'MultipleOptionsAnswerSettings',
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
		const options = computed(() => props.content.options || [])
		const points = ref(0)
		const rightOptions = ref([])

		const updateOptions = () => {
			emit('update:answer-settings', {
				points: points.value,
				options: rightOptions.value
			})
		}

		onMounted(() => {
			if (rightAnswers.value.points !== undefined && rightAnswers.value.points !== null) {
				points.value = rightAnswers.value.points
			}

			if (rightAnswers.value?.options?.length) {
				rightOptions.value = rightAnswers.value.options
			}
		})

		return {
			points,
			options,
			rightOptions,
			updateOptions
		}
	}
}
</script>
