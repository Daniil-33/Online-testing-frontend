<template>
	<v-container>
		<v-row justify="center">
			<v-col xs="12" sm="12" md="12">
				<v-card>
					<v-card-title class="headline">Реєстрація</v-card-title>
					<v-form ref="form">
						<v-card-text>
							<v-text-field
								:error="!formManager.name.$valid && formManager.name.$touched"
								:error-messages="[
									...(formManager.name.$errors.required && formManager.name.$touched ? ['Це поле обов`язкове'] : []),
									...(formManager.name.$errors.minLength && formManager.name.$touched ? ['Ім`я має містити не менше 3 символів'] : []),
								]"
								v-model="formManager.name.model"
								label="Ім`я"
								@blur="formManager.name.onFieldBlur"
							/>

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
									...(formManager.password.$errors.minLength && formManager.password.$touched ? ['Пароль має містити не менше 8 символів'] : []),
								]"
								v-model="formManager.password.model"
								label="Пароль"
								type="password"
								@blur="formManager.password.onFieldBlur"
							/>

							<v-text-field
								:error="!formManager.passwordConfirm.$valid && formManager.passwordConfirm.$touched"
								:error-messages="[
									...(formManager.passwordConfirm.$errors.required && formManager.passwordConfirm.$touched ? ['Пароль повинен бути підтверджений'] : []),
									...(formManager.passwordConfirm.$errors.passwordEqual && formManager.passwordConfirm.$touched ? ['Паролі не однакові'] : []),
								]"
								v-model="formManager.passwordConfirm.model"
								label="Підтвердіть пароль"
								type="password"
								@blur="formManager.passwordConfirm.onFieldBlur"
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
								Зареєструватися
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
import { required, email, minLength } from '@/services/formManager/formValidators';
import { computed } from 'vue';

export default {
	name: 'RegisterForm',
	setup(props, { expose }) {
		const { loadingFlags, register } = useAuth();
		const isLoading = computed(() => loadingFlags.isRegister);

		const formOptions = {
			fields: {
				name: {
					defaultValue: () => 'dan',
					validators: {
						required: v => required(v),
						minLength: v => minLength(v, 3),
					},
				},
				email: {
					defaultValue: () => 'test@gm.co',
					validators: {
						required: v => required(v),
						email: v => email(v),
					},
				},
				password: {
					defaultValue: () => '11111111',
					validators: {
						required: v => required(v),
						minLength: v => minLength(v, 8),
					},
				},
				passwordConfirm: {
					defaultValue: () => '11111111',
					validators: {
						required: v => required(v),
					},
				},
			},
			dependencies: {
                password: {
                    passwordConfirm: {
                        type: 'modelChange',
                        callback: (parentField, field) => {
                            const validatorName = 'passwordEqual'
                            const validatorCallback = () => parentField.model === field.model

                            if (field.validators[validatorName]) {
                                field.removeValidator([validatorName])
                            }

                            field.addValidator([[validatorName, validatorCallback]])
                        }
                    }
                }
            }
		};

		const formManager = FormManager(formOptions);

		const onSubmit = () => {
			if (!formManager.validateForm()) return

			register(formManager.getFormValues());
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
	}
};
</script>

<style>

</style>
