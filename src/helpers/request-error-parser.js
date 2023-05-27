const errorMessages = {
	USER_ALREADY_EXISTS: 'Користувач з такою електронною поштою вже існує',
	USER_NOT_FOUND: 'Користувача з такою електронною поштою не знайдено',
	INVALID_TOKEN: 'Невірний токен',
	INVALID_CREDENTIALS: 'Невірні дані для входу',
	INTERNAL: 'Внутрішня помилка сервера',
	FORBIDDEN: 'Доступ заборонено',
	FORM_NOT_FOUND: 'Форму не знайдено',
	FORM_NOT_ACCEPTING_SUBMISSIONS: 'Форма не приймає відповіді',
	FORM_ALREADY_SUBMITTED: 'Ви вже відправили відповідь на цю форму',
	INVALID_FORM_DATA: 'Невірні дані форми',
	SUBMISSION_VALIDATION_ERROR: 'Помилка валідації відповіді',
}

export function parseError(requestError) {
	if (!requestError.interfaceCode) {
		return errorMessages.INTERNAL
	}

	return errorMessages[requestError.interfaceCode] || errorMessages.INTERNAL
}