import { ref, reactive, computed, watch } from 'vue'

export const questionTypesReference = {
	SHORT_TEXT_ANSWER: 'short-text-answer',
	DETAILED_TEXT_ANSWER: 'detailed-text-answer',
	SINGLE_OPTION: 'single-option',
	MULTIPLE_OPTIONS: 'multiple-options',
	SINGLE_OPTIONS_GRID: 'single-options-grid',
	MULTIPLE_OPTIONS_GRID: 'multiple-options-grid',
}

const createQuestion = (questionReference={}) => {
	return {
		title: '',
		type: 'short-text-answer',
		content: {},
		answerSettings: {},
		isRequired: false,
		timeLimit: 0,

		...questionReference,

		id: Math.random().toString(36).substr(2, 9),
	}
};

export function useFormManager() {
	const title = ref('Unnamed form');
	const description = ref('Without description');

	const questions = ref([]);

	const addQuestion = (afterIndex) => {
		if (afterIndex !== null) {
			questions.value.splice(afterIndex + 1, 0, createQuestion());
		} else {
			questions.value.push(createQuestion());
		}
	};

	const removeQuestion = (index) => {
		questions.value.splice(index, 1);
	};

	const duplicateQuestion = (index) => {
		const question = questions.value[index];
		const duplicatedQuestion = createQuestion(question);

		questions.value.splice(index + 1, 0, duplicatedQuestion);
	};

	const updateQuestion = ({ id, data }) => {
		const question = questions.value.find(({ id: questionId }) => questionId === id);

		const updateTypeHandler = (questionReference, type) => {
			let content = {...questionReference.content };

			if ([questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(type) && [questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(type.value)) {
				content.rows = content.rows || [];
			}

			if ([questionTypesReference.MULTIPLE_OPTIONS, questionTypesReference.SINGLE_OPTION, questionTypesReference.SELECT].includes(type)) {
				content = {
					options: (content.cols || content.options || []).filter(option => !option.isCustomAnswer)
				}
			} else if ([questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(type) && [questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(type.value)) {
				content = {
					rows: content.value.rows,
					cols: (content.options || content.cols || []).filter(option => !option.isCustomAnswer),
				}
			} else if ([questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(type)) {
				content = {
					cols: (content.options || content.cols || []).filter(option => !option.isCustomAnswer),
				}
			}

			questionReference.type = type;
			questionReference.content = content;
			questionReference.answerSettings = {};
		}

		Object.entries(data).forEach(([key, value]) => {
			switch(key) {
				case 'type':
					updateTypeHandler(question, value);
					break;
				default:
					question[key] = value;
					break
			}
		})
	}

	const settings = ref({
		isTest: false,
		generalTimeLimit: 0, // 0 means no limit
		questionDefaultTimeLimit: 0, // 0 means no limit
		mixQuestions: false,
		confirmText: 'Your answers have been submitted.',
		doNotAcceptSubmissions: false,
		formView: 'list', // 'list' | 'steps'

		isAnonymous: false,
		allQuestionsRequired: false,
		submitOnce: true,
	});

	const updateSettings = (data) => {
		Object.entries(data).forEach(([key, value]) => {
			settings.value[key] = value;
		})
	}

	const toConfig = () => {
		return Object.freeze({
			title: title.value,
			description: description.value,
			questions: questions.value,
			settings: settings.value,
		})
	}

	const syncWithConfig = (config) => {
		title.value = config.title;
		description.value = config.description;
		questions.value = config.questions;
		settings.value = config.settings;
	}

	return {
		title,
		description,

		questions,
		addQuestion,
		removeQuestion,
		duplicateQuestion,
		updateQuestion,

		settings,
		updateSettings,

		toConfig,
		syncWithConfig,
	}
}