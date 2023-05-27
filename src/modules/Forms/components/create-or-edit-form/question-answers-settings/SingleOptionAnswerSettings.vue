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
			<v-radio-group
				v-model="rightOption"
				@update:model-value="(rightOption = $event, updateOptions())"
			>
				<v-radio
					color="success"
					v-for="option in options"
					:key="option.id"
					:value="option.id"
					:label="option.text"
					:class="{ 'bg-green-lighten-4 rounded': option.id === rightOption }"
				></v-radio>
			</v-radio-group>
		</v-col>
	</v-row>
</template>
<script>
import { ref, computed, onMounted } from 'vue'

export default {
	name: 'SingleOptionAnswerSettings',
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
		const rightOption = ref(null)

		const updateOptions = () => {
			emit('update:answer-settings', {
				points: points.value,
				options: [rightOption.value]
			})
		}

		onMounted(() => {
			if (rightAnswers.value.points !== undefined && rightAnswers.value.points !== null) {
				points.value = rightAnswers.value.points
			}

			if (rightAnswers.value?.options?.length > 0) {
				rightOption.value = rightAnswers.value.options[0]
			}
		})

		return {
			points,
			options,
			rightOption,
			updateOptions
		}
	}
}
</script>
<style scoped lang="scss">
.right-option {
	background-color: #e0f2f1;
	border-radius: 4px;
	position: relative;

	&:after {
		width: 15px;
		height: 8px;
		border: solid #4caf50;
		border-width: 0 0 2px 2px;
		content: '';
		position: absolute;
		top: 50%;
		right: 20px;
		transform: translate(0, -50%) rotate(-45deg);
	}
}
</style>