<template>
	<div class="view-wrapper form-submit">
		<div class="view-wrapper__inner">
			<SubmitForm :formId="formId" />
		</div>
	</div>
</template>
<script>
import SubmitForm from '../components/SubmitForm.vue';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
	name: 'FormSubmitView',
	components: {
		SubmitForm
	},
	setup() {
		const route = useRoute();
		const formId = computed(() => {
			return route.params.id;
		});

		return {
			formId
		}
	}
}
</script>

<style>
.form-submit {
	position: relative;
}
</style>