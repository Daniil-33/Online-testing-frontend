<template>
	<div class="w-100 h-screen overflow-hidden">
		<SidebarWidget/>

		<div class="px-3 py-3">
			<slot></slot>
		</div>
	</div>
</template>
<script>
import SidebarWidget from '@/components/widgets/SidebarWidget.vue';

export default {
	name: 'DefaultLayout',
	components: {
		SidebarWidget
	},
}
</script>