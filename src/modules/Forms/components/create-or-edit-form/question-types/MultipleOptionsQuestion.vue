<template>
	<draggable
		itemKey="id"
		:list="options"
		@update="updateOptions"
	>
		<template #item="{ element: option, index }">
			<div
				class="d-flex align-center"
				handle=".handle"
			>
				<v-icon class="handle" icon="mdi-drag-vertical" style="margin-right: -5px;"></v-icon>

				<v-checkbox-btn
					class="pr-2"
					:disabled="true"
				></v-checkbox-btn>

				<v-text-field
					v-model="option.text"
					variant="underlined"
					color="primary"
					:value="option.isCustomAnswer ? 'Напишіть власний варіант...' : option.text"
					:disabled="option.isCustomAnswer"
					@change="updateOptions"
				></v-text-field>

				<v-icon
					v-if="options.length !== 1"
					icon="mdi-close"
					@click="removeOption(index)"
				></v-icon>
				<div v-else class="close-placeholder"></div>
			</div>
		</template>
	</draggable>

	<div class="d-flex align-center">
		<v-btn
			variant="plain"
			@click="addOption(false)"
		>
			Додати опцію
		</v-btn>

		<template v-if="isCustomOptionAvailable">
			<span>
				&nbsp;or &nbsp;
			</span>
			<v-btn variant="tonal" @click="addOption(true)">
				Добавити опцію "Власний варіант"
			</v-btn>
		</template>
	</div>
</template>
<script>
import { reactive, computed, onMounted } from 'vue'

import draggable from "vuedraggable";

export default {
	name: 'MultipleOptionsQuestion',
	props: {
		content: {
			type: Object,
			default: () => ({}),
		},
	},
	emits: {
		'update:content': null,
	},
	components: {
		draggable
	},
	setup(props, { emit }) {
		const options = reactive([])

		const isCustomOptionAvailable = computed(() => {
			return options.every((option) => !option.isCustomAnswer)
		})

		const updateOptions = () => {
			emit('update:content', {
				...props.content,
				options: options.map((option) => ({
					...option,
					text: option.text.trim(),
				})),
			})
		}

		const addOption = (isCustom=false) => {
			options.push({
				text: '',
				isCustomAnswer: isCustom,
				id: Math.random().toString(36).substr(2, 9),
			})

			updateOptions()
		}

		const removeOption = (index) => {
			options.splice(index, 1)

			updateOptions()
		}

		onMounted(() => {
			setTimeout(() => {
				if (props.content?.options?.length) {
					options.splice(0, options.length, ...props.content.options)
				} else {
					addOption()
				}
			}, 100)
		})

		return {
			options,
			isCustomOptionAvailable,
			addOption,
			removeOption,
			updateOptions
		}
	}
}
</script>
<style>
.checkbox-pseudo {
	width: 10px;
	height: 10px;

	border: 1px solid #000;
}

.lose-placeholder {
	min-width: 21px;
}
</style>