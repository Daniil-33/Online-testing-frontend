// export const questionTypesReference = {
// 	SHORT_TEXT_ANSWER: 'short-answer',
// 	DETAILED_TEXT_ANSWER: 'long-answer',
// 	MULTIPLE_OPTIONS: 'multiple-choice',
// 	SINGLE_OPTION: 'single-choice',
// 	SELECT: 'select',
// 	RANGE: 'range',
// 	GRID_MULTIPLE_OPTIONS: 'grid-multiple-choice',
// 	MULTIPLE_OPTIONS_GRID: 'grid-flags',
// }
export const questionTypesReference = {
	SHORT_TEXT_ANSWER: 'short-text-answer',
	DETAILED_TEXT_ANSWER: 'detailed-text-answer',
	SINGLE_OPTION: 'single-option',
	MULTIPLE_OPTIONS: 'multiple-options',
	SINGLE_OPTIONS_GRID: 'single-options-grid',
	MULTIPLE_OPTIONS_GRID: 'multiple-options-grid',
}

import { ref, reactive, computed } from 'vue'

export function FormQuestion({
		title: titleP='',
		type: typeP=questionTypesReference.SHORT_TEXT_ANSWER,
		content: contentP='',
		rightAnswers: rightAnswersP={},
		timeLimit: timeLimitP=null,
		required: requiredP=false,
	}) {

	const title = ref(titleP);
	const type = ref(typeP);
	const content = ref(contentP);
	const rightAnswers = ref(rightAnswersP);
	const timeLimit = ref(timeLimitP);
	const required = ref(requiredP);

	const id = Math.random().toString(36).substr(2, 9);

	const model = computed(() => ({
		title: title.value,
		type: type.value,
		content: content.value,
		rightAnswers: rightAnswers.value,
		timeLimit: timeLimit.value,
		required: required.value,
		id: id,
	}))

	const setTitle = (titleP) => {
		title.value = titleP;
	}

	const setType = (typeP) => {
		if ([questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(typeP) && [questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(type.value)) {
			content.value.rows = content.value.rows || [];
		}

		if ([questionTypesReference.MULTIPLE_OPTIONS, questionTypesReference.SINGLE_OPTION, questionTypesReference.SELECT].includes(typeP)) {
			content.value = {
				options: (content.value?.cols || content.value?.options || []).filter(option => !option.isCustomAnswer)
			}
		} else if ([questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(typeP) && [questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(type.value)) {
			content.value = {
				rows: content.value.rows,
				cols: (content.value?.options || content.value?.cols || []).filter(option => !option.isCustomAnswer),
			}
		} else if ([questionTypesReference.MULTIPLE_OPTIONS_GRID, questionTypesReference.SINGLE_OPTIONS_GRID].includes(typeP)) {
			content.value = {
				cols: (content.value?.options || content.value?.cols || []).filter(option => !option.isCustomAnswer),
			}
		}

		type.value = typeP;
		rightAnswers.value = {};
	}

	const setContent = (contentP) => {
		content.value = contentP;
	}

	const setRightAnswers = (rightAnswersP) => {
		rightAnswers.value = rightAnswersP;
	}

	const setTimeLimit = (timeLimitP) => {
		timeLimit.value = timeLimitP;
	}

	const setRequired = (requiredP) => {
		required.value = requiredP;
	}

	const getId = () => {
		return id;
	}

	const toConfig = () => {
		return JSON.parse(JSON.stringify(model.value));
	}

	return {
		model,

		setTitle,
		setType,
		setContent,
		setRightAnswers,
		setTimeLimit,
		setRequired,
		getId,
		toConfig,
	}
}