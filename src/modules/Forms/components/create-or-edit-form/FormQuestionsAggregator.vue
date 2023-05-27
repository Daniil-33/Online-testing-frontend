<template>
	<slot name="form-header"></slot>

	<div
		v-for="(question, index) in questions"
		:key="question.id"
		@click="focusQuestion(question.id)"
	>
		<FormQuestionForm
			:class="{ 'mt-3': index !== 0 }"
			:question="question"
			:isFocused="focusedQuestion === question.id"
			:isTimeLimitActive="isTimeLimitActive"
			@remove:question="removeQuestion(index)"
			@duplicate:question="duplicateQuestion(index)"
			@update:question="updateQuestion(question.id, $event)"
		/>

		<div
			v-if="focusedQuestion === question.id"
			class="mt-3 mb-3"
		>
			<v-btn @click="addQuestion(index)">
				<v-icon left>mdi-plus</v-icon>

				Додати питання
			</v-btn>
		</div>
	</div>

	<div
		v-if="questions.length === 0"
		class="mt-5"
	>
		<v-btn @click="addQuestion(null)">
			<v-icon left>mdi-plus</v-icon>
			Додати питання
		</v-btn>
	</div>
</template>
<script>
import FormQuestionForm from './FormQuestion.vue';
import { ref } from 'vue';

export default {
	name: 'TestQuestionsAggregator',
	components: {
		FormQuestionForm,
	},
	props: {
		questions: {
			type: Array,
			default: () => []
		},
		isTimeLimitActive: {
			type: Boolean,
			default: () => false
		}
	},
	emits: {
		'add:question': null,
		'remove:question': null,
		'duplicate:question': null,
		'update:question': null,
	},
	setup(props, { emit }) {

		const focusedQuestion = ref(null);

		const focusQuestion = (questionId) => {
			focusedQuestion.value = questionId;
		};

		const addQuestion = (index) => {
			emit('add:question', index)
		};

		const removeQuestion = (index) => {
			emit('remove:question', index)
		};

		const duplicateQuestion = (index) => {
			emit('duplicate:question', index)
		};

		const updateQuestion = (id, data) => {
			emit('update:question', { id, data })
		}

		return {
			focusedQuestion,
			focusQuestion,

			addQuestion,
			removeQuestion,
			duplicateQuestion,
			updateQuestion
		}
	}
}
</script>