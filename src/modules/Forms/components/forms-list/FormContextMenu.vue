<template>
	<v-list class="list-custom">
		<v-list-item
			active-color="primary"
			v-for="option in options"
			:key="option.title"
		>
			<div class="d-flex">
				<v-icon
					size="small"
					:icon="option.icon"
				></v-icon>

				<v-list-item-title class="ml-2">
					{{ option.title }}
				</v-list-item-title>
			</div>
		</v-list-item>
	</v-list>
</template>
<script>
export default {
	name: 'FormContextMenu',
	setup() {
		const options = [
			{
				title: 'Edit',
				icon: 'mdi-pencil',
			},
			{
				title: 'Open in new tab',
				icon: 'mdi-open-in-new',
			},
			{
				title: 'Delete',
				icon: 'mdi-trash-can-outline',
			},
		]

		return {
			options
		}
	}
};
</script>
<style lang="scss">
.list-custom {
	& .v-list-item:hover {
		background-color: rgba(0, 0, 0, 0.1);
		cursor: pointer;
	}
}
</style>