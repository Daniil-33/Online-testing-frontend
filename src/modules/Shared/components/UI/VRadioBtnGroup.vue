<template>
	<div class="v-radio-btn-group">
		<template
			v-for="(option, index) in options"
			:key="index"
		>
			<v-btn
				size="small"
				:color="option[value] === modelValue ? 'primary' : 'grey-lighten-3'"
				@click="onUpdateModelValue(option)"
			>
				<slot
					name="option-content"
					:option="option"
				>
					{{ option[label] }}
				</slot>
			</v-btn>
		</template>
	</div>
</template>
<script>
export default {
	name: 'VRadioBtnGroup',
	props: {
		modelValue: {
			type: String,
			required: true
		},
		options: {
			type: Array,
			default: () => []
		},
		value: {
			type: String,
			default: 'value'
		},
		label: {
			type: String,
			default: 'label'
		},
	},
	emits: {
		'update:model-value': null
	},
	setup(props, { emit }) {
		const onUpdateModelValue = (option) => {
			emit('update:model-value', option[props.value]);
		}

		return {
			onUpdateModelValue
		}
	}
}
</script>
<style lang="scss">
.v-radio-btn-group {
	display: flex;
	align-items: center;

	& .v-btn {
		&:not(:first-child) {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}

		&:not(:last-child) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		&:not(:first-child):not(:last-child) {
			border-radius: 0;
		}
	}
}
</style>