<template>
	<v-card class="px-5 py-5">
		<v-row v-if="settings">
			<v-col cols="12">
				<div class="w-100 d-flex align-center justify-space-between mb-3">
					<div>
						<h6 class="text-h6">
							Test
						</h6>
						<p class="text-subtitle-2">
							Настройка максимальных баллов, указание ответов и автоматическая отправка отзывов
						</p>
					</div>
					<v-switch
						style="max-width: fit-content;"
						color="primary"
						value="primary"
						hide-details
						:true-value="true"
						:false-value="false"
						:model-value="settings.isTest"
						@update:model-value="updateSettings('isTest', $event)"
					></v-switch>
				</div>
				<div
					v-if="settings.isTest"
					class="pl-3"
				>
					<div class="mb-2">
						<p class="text-subtitle-2 text-uppercase mb-1">
							ПУБЛИКАЦИЯ ОЦЕНОК
						</p>

						<v-radio-group
							:model-value="settings.showResultsAfter"
							@update:model-value="updateSettings('showResultsAfter', $event)"
						>
							<v-radio
								label="После сдачи"
								value="submission"
							></v-radio>

							<v-radio
								label="После ручной проверки"
								value="check"
							></v-radio>
						</v-radio-group>
					</div>

					<!-- <div class="mb-2">
						<p class="text-subtitle-2 text-uppercase mb-1">
							НАСТРОЙКИ РЕСПОНДЕНТОВ
						</p>

						<div class="w-100 d-flex align-center justify-space-between mb-1">
							<div>
								<p class="text-body-1">
									Незачтенные ответы
								</p>
								<p class="text-body-2">
									Респонденты могут видеть, на какие вопросы даны неверные ответы.
								</p>
							</div>
							<v-switch
								style="max-width: fit-content;"
								color="primary"
								value="primary"
								hide-details
								:true-value="true"
								:false-value="false"
								:model-value="settings.showWrongAnswers"
								@update:model-value="settings.setShowWrongAnswers"
							></v-switch>
						</div>
						<div class="w-100 d-flex align-center justify-space-between mb-1">
							<div>
								<p class="text-body-1">
									Правильные ответы
								</p>
								<p class="text-body-2">
									Респондентам показываются правильные ответы после выставления оценок.
								</p>
							</div>
							<v-switch
								style="max-width: fit-content;"
								color="primary"
								value="primary"
								hide-details
								:true-value="true"
								:false-value="false"
								:model-value="settings.showCorrectAnswers"
								@update:model-value="settings.setShowCorrectAnswers"
							></v-switch>
						</div>
						<div class="w-100 d-flex align-center justify-space-between mb-1">
							<div>
								<p class="text-body-1">
									Баллы за ответы
								</p>
								<p class="text-body-2">
									Респондентам показываются как баллы, полученные за каждый вопрос, так и общее количество баллов.
								</p>
							</div>
							<v-switch
								style="max-width: fit-content;"
								color="primary"
								value="primary"
								hide-details
								:true-value="true"
								:false-value="false"
								:model-value="settings.showPointsPerQuestion"
								@update:model-value="settings.setShowPointsPerQuestion"
							></v-switch>
						</div>
					</div> -->
				</div>

				<v-divider></v-divider>
			</v-col>

			<v-col cols="12">
				<div class="mb-3">
					<h6 class="text-h6">
						Презентация
					</h6>
					<p class="text-subtitle-2">
						Управление представлением формы и ответов на ее вопросы.
					</p>
				</div>

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between mb-1">
						<div class="w-100">
							<p class="text-body-1">
								Ограничить время заполнения формы
							</p>
							<p class="text-body-2 w-75">
								Если вы раннее выставили максимальное время выполнения каждого вопроса, и при этом выставите общее время выполнения формы, то максимальное время выполнения каждого вопроса будет сброшено.
							</p>
						</div>

						<v-switch
							style="max-width: fit-content;"
							color="primary"
							value="primary"
							hide-details
							:false-value="false"
							:true-value="true"
							:model-value="isGeneralTimeLimitActive"
							@update:model-value="setIsGeneralTimeLimitActive"
						></v-switch>
					</div>

					<div
						v-if="isGeneralTimeLimitActive"
						class="d-flex align-center justify-space-start"
					>
						<v-time-picker
							:dropDirection="'down'"
							:model-value="settings.generalTimeLimit"
							@update:model-value="setGeneralTimeLimit"
						/>
					</div>
				</div>

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between mb-1">
						<div class="w-100">
							<p class="text-body-1">
								Ограничить время выполнения каждого вопроса (по умолчанию)
							</p>
							<p class="text-body-2 w-75">
								Если вы раннее выставили максимальное время заполнения формы, то оно будет сброшено. После активации данной опции
								в дополнительных настройках каждого вопроса появится поле для ввода времени.
							</p>
						</div>

						<v-switch
							style="max-width: fit-content;"
							color="primary"
							value="primary"
							hide-details
							:model-value="isQuestionTimeLimitActive"
							@update:model-value="setIsQuestionTimeLimitActive"
						></v-switch>
					</div>

					<div
						v-if="isQuestionTimeLimitActive"
						class="d-flex align-center justify-space-start"
					>
						<v-time-picker
							:dropDirection="'down'"
							:model-value="settings.questionDefaultTimeLimit"
							@update:model-value="setQuestionDefaultTimeLimit"
						/>
					</div>
				</div>

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between">
						<div class="w-100">
							<p class="text-body-1">
								Перемешать вопросы
							</p>
							<p class="text-body-2 w-75">
								Вопросы будут отображаться в случайном порядке.
							</p>
						</div>

						<v-switch
							style="max-width: fit-content;"
							color="primary"
							value="primary"
							hide-details
							:true-value="true"
							:false-value="false"
							:model-value="settings.mixQuestions"
							@update:model-value="updateSettings('mixQuestions', $event)"
						></v-switch>
					</div>
				</div>

				<!-- <div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between">
						<div class="w-100">
							<p class="text-body-1">
								Вид отображения
							</p>
							<p class="text-body-2 w-75">
								Выберите, как будут отображаться вопросы в форме.
							</p>
						</div>
					</div>

					<v-radio-group
						:model-value="settings.formView"
						@update:model-value="updateSettings('formView', $event)"
					>
						<v-radio
							label="Список вопросов"
							value="list"
							:disabled="isQuestionTimeLimitActive"
						></v-radio>

						<v-radio
							label="Каждый вопрос на отдельной странице"
							value="steps"
							:disabled="isQuestionTimeLimitActive"
						></v-radio>
					</v-radio-group>
				</div> -->

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between">
						<div class="w-100">
							<p class="text-body-1">
								Текст после отправки формы
							</p>
							<p class="text-body-2 w-75">
								Текст, который будет отображаться после отправки формы.
							</p>
						</div>
					</div>

					<v-text-field
						style="max-width: 300px;"
						label=""
						variant="underlined"
						:model-value="settings.confirmText"
						@update:model-value="updateSettings('confirmText', $event)"
					></v-text-field>
				</div>

				<!-- <div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between">
						<div class="w-100">
							<p class="text-body-1">
								Текст после отправки формы
							</p>
							<p class="text-body-2 w-75">
								Текст, который будет отображаться после отправки формы.
							</p>
						</div>
					</div>

					<v-text-field
						style="max-width: 300px;"
						label="Текст после отправки формы"
						variant="underlined"
						v-model="confirmText"
						@change="onChange"
					></v-text-field>
				</div> -->

				<v-divider></v-divider>
			</v-col>

			<v-col cols="12">
				<div class="mb-3">
					<h6 class="text-h6">
						Общее
					</h6>
					<p class="text-subtitle-2">
						Общие настройки формы
					</p>
				</div>

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between mb-1">
						<div class="w-100">
							<p class="text-body-1">
								Собирать электронные адреса
							</p>
							<p class="text-body-2 w-75">
								Если включено, то в форме будет поле для ввода электронного адреса.
							</p>
						</div>

						<v-switch
							style="max-width: fit-content;"
							color="primary"
							value="primary"
							hide-details
							:true-value="true"
							:false-value="false"
							:model-value="settings.pickEmail"
							@update:model-value="updateSettings('pickEmail', $event)"
						></v-switch>
					</div>
				</div>

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between mb-1">
						<div class="w-100">
							<p class="text-body-1">
								Позволить отправлять форму только один раз
							</p>
							<p class="text-body-2 w-75">
								Если включено, то после отправки формы респондент не сможет отправить ее еще раз.
							</p>
						</div>

						<v-switch
							style="max-width: fit-content;"
							color="primary"
							value="primary"
							hide-details
							:true-value="true"
							:false-value="false"
							:model-value="settings.submitOnce"
							@update:model-value="updateSettings('submitOnce', $event)"
						></v-switch>
					</div>
				</div>

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between mb-1">
						<div class="w-100">
							<p class="text-body-1">
								Не принимать ответы
							</p>
							<p class="text-body-2 w-75">
								Если включено, то форма будет недоступна для заполнения.
							</p>
						</div>

						<v-switch
							style="max-width: fit-content;"
							color="primary"
							value="primary"
							hide-details
							:true-value="true"
							:false-value="false"
							:model-value="settings.doNotAcceptSubmissions"
							@update:model-value="updateSettings('doNotAcceptSubmissions', $event)"
						></v-switch>
					</div>
				</div>

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between mb-1">
						<div class="w-100">
							<p class="text-body-1">
								Все вопросы обязательны
							</p>
							<p class="text-body-2 w-75">
								Если включено, то респондент не сможет отправить форму, если не ответит на все вопросы.
							</p>
						</div>

						<v-switch
							style="max-width: fit-content;"
							color="primary"
							value="primary"
							hide-details
							:true-value="true"
							:false-value="false"
							:model-value="settings.allQuestionsRequired"
							@update:model-value="updateSettings('allQuestionsRequired', $event)"
						></v-switch>
					</div>
				</div>
			</v-col>
		</v-row>
	</v-card>
</template>
<script>
import { ref, watch, onMounted } from 'vue';


export default {
	name: 'FormSettings',
	props: {
		settings: {
			type: Object,
			default: () => ({}),
		}
	},
	emits: {
		'reset:questionTimeLimit': null,
		'update:settings': null,
	},
	setup(props, { emit }) {
		const isGeneralTimeLimitActive = ref(props.settings.generalTimeLimit > 0);
		const isQuestionTimeLimitActive = ref(props.settings.questionDefaultTimeLimit > 0);

		// watch(() => isGeneralTimeLimitActive.value, () => {
		// 	if (!isGeneralTimeLimitActive.value) {
		// 		updateSettings('generalTimeLimit', 0);
		// 		updateSettings('formView', 'steps');
		// 	} else {
		// 		isQuestionTimeLimitActive.value = false;

		// 		updateSettings('questionDefaultTimeLimit', 0);
		// 		updateSettings('formView', 'list');
		// 	}
		// })

		// watch(() => isQuestionTimeLimitActive.value, () => {
		// 	if (!isQuestionTimeLimitActive.value) {
		// 		updateSettings('questionDefaultTimeLimit', 0);
		// 		updateSettings('formView', 'list');
		// 	} else {
		// 		isGeneralTimeLimitActive.value = false;

		// 		updateSettings('generalTimeLimit', 0);
		// 		updateSettings('formView', 'steps');
		// 	}
		// })

		const setGeneralTimeLimit = (value) => {
			updateSettings('generalTimeLimit', value);
		}

		const setQuestionDefaultTimeLimit = (value) => {
			updateSettings('questionDefaultTimeLimit', value);
		}

		const setIsGeneralTimeLimitActive = (value) => {
			isGeneralTimeLimitActive.value = value;

			if (value) {
				isQuestionTimeLimitActive.value = false;

				updateSettings('questionDefaultTimeLimit', 0);
				updateSettings('formView', 'list');
			}
		}

		const setIsQuestionTimeLimitActive = (value) => {
			isQuestionTimeLimitActive.value = value;

			if (value) {
				isGeneralTimeLimitActive.value = false;

				updateSettings('generalTimeLimit', 0);
				updateSettings('formView', 'steps');
			}
		}

		const updateSettings = (key, value) => {
			emit('update:settings', { [key]: value })
		}

		return {
			isGeneralTimeLimitActive,
			setGeneralTimeLimit,
			setIsGeneralTimeLimitActive,

			isQuestionTimeLimitActive,
			setQuestionDefaultTimeLimit,
			setIsQuestionTimeLimitActive,

			updateSettings,
		}
	}
}
</script>