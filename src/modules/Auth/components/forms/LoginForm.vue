<template>
	<v-container>
		<v-row justify="center">
			<v-col xs="12" sm="12" md="12">
				<v-card>
					<v-card-title class="headline">Авторизація</v-card-title>

					<v-form ref="form">
						<v-card-text>
							<v-text-field
								:error="!formManager.email.$valid && formManager.email.$touched"
								:error-messages="[
									...(formManager.email.$errors.required && formManager.email.$touched ? ['Це поле обов`язкове'] : []),
									...(formManager.email.$errors.email && formManager.email.$touched ? ['Введіть коректну електронну пошту'] : []),
								]"
								v-model="formManager.email.model"
								label="Електронна пошта"
								type="email"
								@blur="formManager.email.onFieldBlur"
							/>

							<v-text-field
								:error="!formManager.password.$valid && formManager.password.$touched"
								:error-messages="[
									...(formManager.password.$errors.required && formManager.password.$touched ? ['Це поле обов`язкове'] : []),
								]"
								v-model="formManager.password.model"
								label="Пароль"
								type="password"
								@blur="formManager.password.onFieldBlur"
							/>
						</v-card-text>
						<v-card-actions>
							<v-spacer />
							<v-btn
								color="primary"
								:loading="isLoading"
								:disabled="isLoading"
								@click="onSubmit"
							>
								Авторизуватися
							</v-btn>
						</v-card-actions>
					</v-form>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import useAuth from '../../composables/useAuth';
import FormManager from '@/services/formManager/formManagerService';
import { required, email } from '@/services/formManager/formValidators';
import { computed } from 'vue';

export default {
	name: 'LoginForm',
	setup(props, { expose }) {
		const { loadingFlags, login } = useAuth();
		const isLoading = computed(() => loadingFlags.isRegister);

		const formOptions = {
			fields: {
				email: {
					value: '',
					validators: {
						required: v => required(v),
						email: v => email(v),
					},
				},
				password: {
					value: '',
					validators: {
						required: v => required(v),
					},
				},
			},
		};

		const formManager = FormManager(formOptions);

		const onSubmit = () => {
			if (!formManager.validateForm()) return

			login(formManager.getFormValues());
		};

		const resetForm = () => {
			formManager.reset();
		};

		expose({
			resetForm,
		});

		return {
			formManager,
			isLoading,
			onSubmit
		}
	},
};
</script>

<style>

</style>