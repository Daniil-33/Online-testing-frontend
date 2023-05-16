import { ref, computed } from 'vue';

export function FromSettings({
	isTest: isTestP = true,
	showCorrectAnswers: showCorrectAnswersP = false,
	showWrongAnswers: showWrongAnswersP = false,
	showPointsPerQuestion: showPointsPerQuestionP = false,
	showResultsAfter: showResultsAfterP = 'submission', // 'submission' | 'check'

	generalTimeLimit: generalTimeLimitP = 0, // 0 - no time Limit
	questionDefaultTimeLimit: questionDefaultTimeLimitP = 0, // 0 - no time Limit
	mixQuestions: mixQuestionsP = false,
	confirmText: confirmTextP = '',
	doNotAcceptSubmissions: doNotAcceptSubmissionsP = false,
	formView: formViewP = 'list', // 'list' | 'steps'
	openFormAt: openFormAtP = null,
	closeFormAt: closeFormAtP = null,

	pickEmail: pickEmailP = false,
	allQuestionsRequired: allQuestionsRequiredP = false,
	submitOnce: submitOnceP = false,
}) {
	// Form test mode
	const isTest = ref(isTestP);
	const showCorrectAnswers = ref(showCorrectAnswersP);
	const showWrongAnswers = ref(showWrongAnswersP);
	const showPointsPerQuestion = ref(showPointsPerQuestionP);
	const showResultsAfter = ref(showResultsAfterP); // 'submission' | 'check'

	// Form appearance
	const generalTimeLimit = ref(generalTimeLimitP); // 0 - no time Limit
	const questionDefaultTimeLimit = ref(questionDefaultTimeLimitP); // 0 - no time Limit
	const mixQuestions = ref(mixQuestionsP);
	const confirmText = ref(confirmTextP);
	const doNotAcceptSubmissions = ref(doNotAcceptSubmissionsP);
	const formView = ref(formViewP); // 'list' | 'steps'
	const openFormAt = ref(openFormAtP);
	const closeFormAt = ref(closeFormAtP);

	// Default settings
	const pickEmail = ref(pickEmailP);
	const allQuestionsRequired = ref(allQuestionsRequiredP);
	const submitOnce = ref(submitOnceP);

	const model = computed(() => ({
		isTest: isTest.value,
		showCorrectAnswers: showCorrectAnswers.value,
		showWrongAnswers: showWrongAnswers.value,
		showPointsPerQuestion: showPointsPerQuestion.value,
		showResultsAfter: showResultsAfter.value,

		generalTimeLimit: generalTimeLimit.value,
		questionDefaultTimeLimit: questionDefaultTimeLimit.value,
		mixQuestions: mixQuestions.value,
		confirmText: confirmText.value,
		doNotAcceptSubmissions: doNotAcceptSubmissions.value,
		formView: formView.value,
		openFormAt: openFormAt.value,
		closeFormAt: closeFormAt.value,

		pickEmail: pickEmail.value,
		allQuestionsRequired: allQuestionsRequired.value,
		submitOnce: submitOnce.value,
	}))

	const setTestMode = (isTestP) => {
		isTest.value = !!isTestP;
	}

	const setShowCorrectAnswers = (showCorrectAnswersP) => {
		showCorrectAnswers.value = showCorrectAnswersP;
	}

	const setShowWrongAnswers = (showWrongAnswersP) => {
		showWrongAnswers.value = showWrongAnswersP;
	}

	const setShowPointsPerQuestion = (showPointsPerQuestionP) => {
		showPointsPerQuestion.value = showPointsPerQuestionP;
	}

	const setShowResultsAfter = (showResultsAfterP) => {
		if (!['submission','check'].includes(showResultsAfterP)) {
			throw new Error('showResultsAfter can be only "submission" or "check"');
		}

		showResultsAfter.value = showResultsAfterP;
	}

	const setGeneralTimeLimit = (milliseconds) => {
		generalTimeLimit.value = milliseconds;
	}

	const setQuestionDefaultTimeLimit = (milliseconds) => {
		questionDefaultTimeLimit.value = milliseconds;
	}

	const setMixQuestions = (mixQuestionsP) => {
		mixQuestions.value = mixQuestionsP;
	}

	const setConfirmText = (confirmTextP) => {
		confirmText.value = confirmTextP;
	}

	const setDoNotAcceptSubmissions = (doNotAcceptSubmissionsP) => {
		doNotAcceptSubmissions.value = doNotAcceptSubmissionsP;
	}

	const setFormView = (formViewP) => {
		if (!['list','steps'].includes(formViewP)) {
			throw new Error('formView can be only "list" or "steps"');
		}

		formView.value = formViewP;
	}

	const setOpenFormAt = (openFormAtP) => {
		openFormAt.value = openFormAtP;
	}

	const setCloseFormAt = (closeFormAtP) => {
		closeFormAt.value = closeFormAtP;
	}

	const setPickEmail = (pickEmailP) => {
		pickEmail.value = pickEmailP;
	}

	const setAllQuestionsRequired = (allQuestionsRequiredP) => {
		allQuestionsRequired.value = allQuestionsRequiredP;
	}

	const setSubmitOnce = (submitOnceP) => {
		submitOnce.value = submitOnceP;
	}

	const toConfig = () => {
		return JSON.parse(JSON.stringify(model.value));
	}

	return {
		model,

		setTestMode,
		setShowCorrectAnswers,
		setShowWrongAnswers,
		setShowPointsPerQuestion,
		setShowResultsAfter,
		setGeneralTimeLimit,
		setQuestionDefaultTimeLimit,
		setMixQuestions,
		setConfirmText,
		setDoNotAcceptSubmissions,
		setFormView,
		setOpenFormAt,
		setCloseFormAt,
		setPickEmail,
		setAllQuestionsRequired,
		setSubmitOnce,
		toConfig,
	}
}