<template>
	<div class="ui-button-group-toggler">
		<v-btn
			v-for="(item, index) in items"
			:key="item.value"
			:color="item.value === modelValue ? 'primary' : ''"
			:class="{ 'mr-2': index !== items.length - 1 }"
			@click="$emit('update:model-value', item.value)"
			size="small"
		>
			{{ item.title }}
		</v-btn>
	</div>
</template>
<script>
export default {
	name: 'UiButtonsGroupToggler',
	props: {
		modelValue: {
			type: String,
			default: () => 'table',
		},
		items: {
			type: Array,
			default: () => []
		}
	},
	emits: ['update:model-value'],
}
</script>
<style scoped lang="scss">
.ui-button-group-toggler {
	padding: 8px;

	background-color: rgba(235, 235, 235, 1);
	border-radius: 4px;
	max-width: fit-content;
}
</style>