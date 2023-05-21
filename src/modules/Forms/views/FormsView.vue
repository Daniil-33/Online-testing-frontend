<template>
	<router-view v-slot="{ Component, route }">
		<Transition name="scale" mode="out-in">
			<div :key="route.name">
				<component :is="Component"></component>
			</div>
		</Transition>
	</router-view>
</template>
<script>
export default {
	name: 'FormsView',
};
</script>
<style>
.scale-enter-active,
.scale-leave-active {
 	 transition: all 0.1s ease;
}

.scale-enter-from,
.scale-leave-to {
	opacity: 0;
	transform: scale(0.95);
}
</style>