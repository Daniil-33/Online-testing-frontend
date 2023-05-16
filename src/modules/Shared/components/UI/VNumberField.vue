<template>
	<!-- <div class="v-number-field"> -->
		<v-text-field
			variant="underlined"
			color="primary"
			class="v-number-field"
			:label="label"
			:model-value="modelValue"
			@update:model-value="updateValue"
		>
			<template #append>
				<div class="d-flex flex-column">
					<v-icon size="x-small" @click="updateValue(modelValue + 1)">mdi-plus</v-icon>
					<v-icon size="x-small" @click="updateValue(modelValue - 1)">mdi-minus</v-icon>
				</div>
			</template>
		</v-text-field>
	<!-- </div> -->
</template>
<script>
export default {
	name: 'VNumberField',
	props: {
		modelValue: {
			type: Number,
			default: () => 0,
		},
		label: {
			type: String,
			default: () => '',
		},
		min: {
			type: Number,
			default: () => 0,
		}
	},
	emits: {
		'update:model-value': null,
	},
	setup(props, { emit }) {
		const updateValue = (value) => {
			if (value < props.min) {
				value = props.min
			}

			emit('update:model-value', value)
		}

		return {
			updateValue,
		}
	},
}
</script>
<style>
.v-number-field .v-input__details {
	display: none;
}
</style>