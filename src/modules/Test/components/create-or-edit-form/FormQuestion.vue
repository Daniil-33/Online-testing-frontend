<template>
	<v-card
		class="question-form"
		:class="{ 'question-form--focused': isFocused }"
	>
		<v-card-text>
			<template v-if="settingRightAnswersMode">
				<component
					:is="selectedQuestionTypeRightAnswerComponent"
					:title="title"
					:content="content"
					:answerSettings="questionAnswerSettings"
					@update:answer-settings="setQuestionAnswerSettings"
				/>
			</template>
			<template v-else>
				<v-row>
					<v-col cols="6">
						<v-text-field
							label="Question Title"
							variant="underlined"
							color="primary"
							:model-value="title"
							@update:model-value="setQuestionTitle"
						></v-text-field>
					</v-col>
					<v-col
						cols="6"
					>
						<v-select
							label="Question Type"
							variant="underlined"
							color="primary"
							:model-value="type"
							:items="questionTypesComponentsReference"
							:item-title="'text'"
							:item-value="'value'"
							@update:model-value="setQuestionType"
						></v-select>
					</v-col>

					<v-col cols="12">
						<component
							:is="selectedQuestionTypeComponent"
							:content="content"
							@update:content="setQuestionContent"
						/>
					</v-col>
				</v-row>
			</template>
		</v-card-text>
		<v-card-actions>
			<div
				v-if="isFocused"
				class="w-100"
			>
				<v-divider class="mb-3"></v-divider>

				<div
					class="w-100 d-flex align-center"
					:class="(isTestModeActive && !settingRightAnswersMode) ? 'justify-space-between' : 'justify-end'"
				>
					<template v-if="!settingRightAnswersMode">
						<div class="d-flex align-center">
							<v-btn
								v-if="isTestModeActive"
								color="primary"
								variant="tonal"
								prepend-icon="mdi-clipboard-check "
								@click="settingRightAnswersMode = true"
							>
								Answers
							</v-btn>

							<div class="ml-1 d-flex align-center">({{ questionPoints }} points)</div>
						</div>
						<div class="d-flex align-items-center">
							<v-btn
								text
								size="small"
								@click="duplicateQuestion"
							>
								<v-icon icon="mdi-content-copy"></v-icon>
							</v-btn>

							<v-btn
								text
								size="small"
								@click="removeQuestion"
							>
								<v-icon icon="mdi-delete-outline"></v-icon>
							</v-btn>

							<v-menu
								location="top left"
								:close-on-content-click="false"
							>
								<template v-slot:activator="{ props }">
									<v-btn
										text
										v-bind="props"
										size="small"
									>
										<v-icon icon="mdi-cog-outline"></v-icon>
									</v-btn>
								</template>

								<v-card>
									<v-card-text>
										<v-checkbox
											class="no-input-details checkbox-sm"
											color="primary"
											label="Required question"
											:model-value="isRequired"
											@update:model-value="setQuestionIsRequired"
										></v-checkbox>

										<v-divider class="mt-2"></v-divider>

										<div class="mt-2">
											<p class="text-body mb-1">Strict question time</p>

											<VTimePicker />
										</div>
									</v-card-text>
								</v-card>
							</v-menu>
						</div>
					</template>
					<template v-else>
						<v-btn
							color="primary"
							variant="tonal"
							@click="settingRightAnswersMode = false"
						>
							Done
						</v-btn>
					</template>
				</div>
			</div>
		</v-card-actions>
	</v-card>
</template>

<script>
import {
	ShortTextQuestion,
	DetailedTextQuestion,

	MultipleOptionsQuestion,
	SingleOptionQuestion,


	SingleOptionsGridQuestion,
	MultipleOptionsGridQuestion,
} from './question-types/';

import {
	ShortTextAnswerSettings,
	DetailedTextAnswerSettings,

	SingleOptionAnswerSettings,
	MultipleOptionsAnswerSettings,

	SingleOptionsGridAnswerSettings,
	MultipleOptionsGridAnswerSettings,
} from './question-answers-settings/'

import { VTimePicker } from '@/modules/Shared/'

import { computed , ref, watch } from 'vue';
import { questionTypesReference } from '../../models/FormQuestion'

const questionTypesComponentsReference = [
	{
		text: 'Short Answer',
		value: questionTypesReference.SHORT_TEXT_ANSWER,
		componentName: 'ShortTextQuestion',
		settingRightAnswersComponentName: 'ShortTextAnswerSettings',
	},
	{
		text: 'Detailed Answer',
		value: questionTypesReference.DETAILED_TEXT_ANSWER,
		componentName: 'DetailedTextQuestion',
		settingRightAnswersComponentName: 'DetailedTextAnswerSettings',
	},
	{
		text: 'Multiple Choice',
		value: questionTypesReference.MULTIPLE_OPTIONS,
		componentName: 'MultipleOptionsQuestion',
		settingRightAnswersComponentName: 'MultipleOptionsAnswerSettings',
	},
	{
		text: 'Single Choice',
		value: questionTypesReference.SINGLE_OPTION,
		componentName: 'SingleOptionQuestion',
		settingRightAnswersComponentName: 'SingleOptionAnswerSettings',
	},
	{
		text: 'Grid of single choices',
		value: questionTypesReference.SINGLE_OPTIONS_GRID,
		componentName: 'SingleOptionsGridQuestion',
		settingRightAnswersComponentName: 'SingleOptionsGridAnswerSettings',
	},
	{
		text: 'Grid of multiple choices',
		value: questionTypesReference.MULTIPLE_OPTIONS_GRID,
		componentName: 'MultipleOptionsGridQuestion',
		settingRightAnswersComponentName: 'MultipleOptionsGridAnswerSettings',
	},
];

export default {
	name: 'FormQuestion',
	props: {
		isFocused: {
			type: Boolean,
			default: false,
		},
		question: {
			type: Object,
			default: () => ({})
		},
		isTestModeActive: {
			type: Boolean,
			default: () => false,
		}
	},
	emits: {
		'duplicate:question': null,
		'remove:question': null,
		'update:question': null,
	},
	components: {
		// Question types
		ShortTextQuestion,
		DetailedTextQuestion,

		MultipleOptionsQuestion,
		SingleOptionQuestion,


		SingleOptionsGridQuestion,
		MultipleOptionsGridQuestion,

		// Question right answers settings
		ShortTextAnswerSettings,
		DetailedTextAnswerSettings,

		SingleOptionAnswerSettings,
		MultipleOptionsAnswerSettings,

		SingleOptionsGridAnswerSettings,
		MultipleOptionsGridAnswerSettings,

		VTimePicker
	},
	setup(props, { emit }) {
		const settingRightAnswersMode = ref(false);
		const selectedQuestionTypeComponent = computed(() => questionTypesComponentsReference.find(({ value }) => value === props.question.type).componentName);
		const selectedQuestionTypeRightAnswerComponent = computed(() => questionTypesComponentsReference.find(({ value }) => value === props.question.type).settingRightAnswersComponentName);
		const title = computed(() => props.question.title)
		const type = computed(() => props.question.type)
		const isRequired = computed(() => props.question.required)
		const content = computed(() => props.question.content)
		const questionPoints = computed(() => props.question.answerSettings?.points || 0)
		const questionAnswerSettings = computed(() => props.question.answerSettings)

		const setQuestionTitle = (title) => {
			emit('update:question', { title });
		}

		const setQuestionType = (type) => {
			emit('update:question', { type });
		}

		const setQuestionIsRequired = (isRequired) => {
			emit('update:question', { isRequired });
		}

		const setQuestionContent = (content) => {
			emit('update:question', { content });
		}

		const setQuestionAnswerSettings = (answerSettings) => {
			emit('update:question', { answerSettings });
		}

		const duplicateQuestion = () => {
			emit('duplicate:question');
		}

		const removeQuestion = () => {
			emit('remove:question');
		}

		return {
			questionTypesComponentsReference,
			settingRightAnswersMode,
			selectedQuestionTypeComponent,
			selectedQuestionTypeRightAnswerComponent,

			duplicateQuestion,
			removeQuestion,

			title,
			type,
			isRequired,
			content,
			questionPoints,
			questionAnswerSettings,

			setQuestionTitle,
			setQuestionType,
			setQuestionIsRequired,
			setQuestionContent,
			setQuestionAnswerSettings,
		};
	}
}
</script>
