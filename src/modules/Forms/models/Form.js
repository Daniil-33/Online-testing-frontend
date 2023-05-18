import { FromSettings } from "./FormSettings";
import { FormQuestion } from "./FormQuestion";
import { ref, computed } from "vue";

export function Form({
	title: titleP = '',
	description: descriptionP = '',
	questions: questionsP = [],
	formSettings: formSettingsP = {},
}) {
	const title = ref(titleP);
	const description = ref(descriptionP);
	const questions = ref(questionsP);
	const formSettings = FromSettings(formSettingsP);

	const model = computed(() => ({
		title: title.value,
		description: description.value,
		questions: questions.value,
		formSettings: formSettings,
	}))

	const setTitle = (titleP) => {
		title.value = titleP;
	};

	const setDescription = (descriptionP) => {
		description.value = descriptionP;
	};

	const addQuestion = (afterIndex) => {
		if (afterIndex !== null) {
			questions.value.splice(afterIndex + 1, 0, FormQuestion({}));
		} else {
			questions.value.push(FormQuestion({}));
		}

		console.log(model)
	};

	const removeQuestion = (index) => {
		questions.value.splice(index, 1);
	}

	const duplicateQuestion = (index) => {
		const question = questions.value[index];
		const duplicatedQuestion = FormQuestion(question.toConfig());

		questions.value.splice(index + 1, 0, duplicatedQuestion);
	}

	const updateQuestion = ({ index, content }) => {
		const question = questions.value[index];

		question.setContent(content);
	}

	const setFormSettings = (formSettingsP) => {
		if (formSettingsP.toConfig) {
			formSettings.value = formSettingsP;
		} else {
			formSettings.value = FromSettings(formSettingsP);
		}
	};

	const toConfig = () => {
		return JSON.parse(JSON.stringify({
			...model.value,
			formSettings: formSettings.toConfig(),
		}));
	};

	return {
		title,
		description,
		questions,
		formSettings,

		setTitle,
		setDescription,
		addQuestion,
		removeQuestion,
		duplicateQuestion,
		updateQuestion,
		setFormSettings,
		toConfig,
	};
}