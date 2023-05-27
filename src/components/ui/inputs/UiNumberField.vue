<template>
	<!-- <div class="d-flex align-center">
		<div>
			<v-text-field
				variant="underlined"
				color="primary"
				class="ui-number-field"
				hide-details
				:model-value="modelValue"
				@update:model-value="updateValue"
			>
			</v-text-field>
		</div>
		<div class="d-flex flex-column">
			<v-icon size="x-small" @click="updateValue(modelValue + 1)">mdi-plus</v-icon>
			<v-icon size="x-small" @click="updateValue(modelValue - 1)">mdi-minus</v-icon>
		</div>
	</div> -->

	<div class="ui-number-field">
		<input
			type="number"
			:value="modelValue"
			:min="min"
			@change="updateValue($event.target.value)"
		>
	</div>
</template>
<script>
export default {
	name: 'UiNumberField',
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
<style lang="scss">
.ui-number-field {
	& input {
		border: 1px solid #ccc;
		border-radius: 4px;
		padding-left: 4px;
		font-size: 12px;

		max-width: 100%;
		width: 100%;
		display: block;
		box-sizing: border-box;
		transition: all .2s linear;
	}

	& input:focus {
		outline: none;
		border-color: rgb(var(--v-theme-primary));
	}
}
</style>