<template>
	<v-card class="px-5 py-5">
		<v-row v-if="settings">
			<v-col cols="12">
				<div
					v-if="settings.isTest"
					class="pl-3"
				>
					<div class="mb-2">
						<p class="text-subtitle-2 text-uppercase mb-1">
							Публікаця оцінок
						</p>

						<v-radio-group
							:model-value="settings.showResultsAfter"
							@update:model-value="updateSettings('showResultsAfter', $event)"
						>
							<v-radio
								label="После здачі"
								value="submission"
							></v-radio>

							<v-radio
								label="Після особистої перевірки"
								value="check"
							></v-radio>
						</v-radio-group>
					</div>
				</div>

				<v-divider></v-divider>
			</v-col>

			<v-col cols="12">
				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between mb-1">
						<div class="w-100">
							<p class="text-body-1">
								Обмежити час заповнення форми
							</p>
							<p class="text-body-2 w-75">
								Якщо ви раніше виставили максимальний час виконання кожного питання, і при цьому виставите загальний час виконання форми, то максимальний час виконання кожного питання буде скинуто.
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
						<ui-time-picker
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
								Обмежити час виконання кожного питання (за замочвучанням)
							</p>
							<p class="text-body-2 w-75">
								Якщо ви раніше виставили максимальний час заповнення форми, воно буде скинуто. Після активації цієї опції
								у додаткових параметрах кожного питання з'явиться поле для введення часу.
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
						<ui-time-picker
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
								Перемішати питання
							</p>
							<p class="text-body-2 w-75">
								Запитання відображатимуться у випадковому порядку.
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

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between">
						<div class="w-100">
							<p class="text-body-1">
								Текст після здачі форми
							</p>
							<p class="text-body-2 w-75">
								Текст, який відображатиметься після здачі форми.
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

				<v-divider></v-divider>
			</v-col>

			<v-col cols="12">
				<div class="mb-3">
					<h6 class="text-h6">
						Загальне
					</h6>
					<p class="text-subtitle-2">
						Загальні налаштування форми
					</p>
				</div>

				<div class="mb-2">
					<div class="w-100 d-flex align-center justify-space-between mb-1">
						<div class="w-100">
							<p class="text-body-1">
								Дозволити надсилати форму лише один раз
							</p>
							<p class="text-body-2 w-75">
								Якщо увімкнено, після відправлення форми респондент не зможе відправити її ще раз.
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
								Не приймати відповіді
							</p>
							<p class="text-body-2 w-75">
								Якщо увімкнено, форма буде недоступна для заповнення.
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
								Усі питання обов'язкові
							</p>
							<p class="text-body-2 w-75">
								Якщо увімкнено, то респондент не зможе надіслати форму, якщо не відповість на всі запитання.
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
import { ref } from 'vue';


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

		const setGeneralTimeLimit = (value) => {
			updateSettings('generalTimeLimit', value);
		}

		const setQuestionDefaultTimeLimit = (value) => {
			updateSettings('questionDefaultTimeLimit', value);
		}

		const setIsGeneralTimeLimitActive = (value) => {
			isGeneralTimeLimitActive.value = value;

			updateSettings('questionDefaultTimeLimit', 0);
			updateSettings('generalTimeLimit', 0);
			updateSettings('formView', 'list');

			if (value) {
				isQuestionTimeLimitActive.value = false;

			}
		}

		const setIsQuestionTimeLimitActive = (value) => {
			isQuestionTimeLimitActive.value = value;

			updateSettings('generalTimeLimit', 0);
			updateSettings('questionDefaultTimeLimit', 0);

			if (value) {
				isGeneralTimeLimitActive.value = false;

				updateSettings('formView', 'steps');
			} else {
				updateSettings('formView', 'list');
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