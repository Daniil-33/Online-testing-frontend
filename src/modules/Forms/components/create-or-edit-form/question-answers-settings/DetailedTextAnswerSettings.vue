<template>
	<v-row>
		<v-col cols="10">
			<p
				class="text-h5"
				:class="{ 'text-disabled': !title }"
			>
				{{ title || 'Question title' }}
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
	</v-row>
</template>
<script>
import { ref, onMounted, computed } from 'vue'

export default {
	name: 'DetailedTextAnswerSettings',
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
		const points = ref(0)
		const rightAnswers = computed(() => props.answerSettings || {})

		const updateOptions = () => {
			emit('update:answer-settings', {
				points: points.value,
			})
		}

		onMounted(() => {
			if (rightAnswers.value.points !== undefined && rightAnswers.value.points !== null) {
				points.value = rightAnswers.value.points
			}
		})

		return {
			points,
			updateOptions,
		}
	}
}
</script>