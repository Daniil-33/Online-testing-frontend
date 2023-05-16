<template>
	<v-list class="list-custom">
		<v-list-item active-color="primary">
			<div class="d-flex">
				<v-icon icon="mdi-pencil" size="small"></v-icon>
				<v-list-item-title class="ml-2">
					Edit
				</v-list-item-title>
			</div>
		</v-list-item>
		<v-list-item>
			<div class="d-flex">
				<v-icon icon="mdi-open-in-new" size="small"></v-icon>
				<v-list-item-title class="ml-2">
					Open in new tab
				</v-list-item-title>
			</div>
		</v-list-item>
		<v-list-item>
			<div class="d-flex">
				<v-icon icon="mdi-trash-can-outline" size="small"></v-icon>
				<v-list-item-title class="ml-2">
					Delete
				</v-list-item-title>
			</div>
		</v-list-item>
	</v-list>
</template>
<script>
export default {
	name: 'FormCardContextMenuList',
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