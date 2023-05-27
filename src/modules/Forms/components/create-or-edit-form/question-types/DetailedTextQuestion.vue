<template>
	<v-text-field
		v-model="modelValue"
		label="Розгорнута відповідь"
		variant="underlined"
		color="primary"
		:disabled="true"
		@update:modelValue="$emit('update:modelValue', $event)"
	></v-text-field>
</template>
<script>
export default {
	name: 'DetailedTextQuestion',
	props: {
		modelValue: {
			type: String,
			default: () => '',
		},
		mode: {
			type: String,
			default: () => 'create', // create / render
		},
	},
	emits: {
		'update:modelValue': null,
	},
}
</script>