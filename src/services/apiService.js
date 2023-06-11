import getRequestServiceInstance from './requestService.js';

export default class ApiService {
	constructor(config, options={}) {
		this.options = {
			allowUnauthorized: options.allowUnauthorized || false,
		};
		this.config = config;
		this.requestService = getRequestServiceInstance();
	}

	_generateRequestUrl(endpointName, params) {
		const { url: urlPattern } = this.config[endpointName];

		const url = urlPattern.replace(/:([a-zA-Z0-9_]+)/g, (match, paramName) => {
			if (!params[paramName]) {
				throw new Error(`Param ${paramName} not found in params`);
			}

			return params[paramName];
		});

		return import.meta.env.VITE_APP_BACK_API_URL + url;
	}

	_createRequestPayload(endpointName, requestConfig) {
		const { params, data, queryParams } = requestConfig;

		return {
			...this.config[endpointName],
			url: this._generateRequestUrl(endpointName, params),
			params: queryParams,
			data,
		};
	}

	setAccessToken(accessToken) {
		this.requestService.setAccessToken(accessToken);
	}

	request(endpointName, requestConfig) {
		if (!this.config[endpointName]) {
			throw new Error(`Endpoint ${endpointName} not found`);
		}

		if (!this.requestService.isAccessTokenExist() && !this.options.allowUnauthorized) {
			throw new Error('Access token was not set');
		}

		const requestPayload = this._createRequestPayload(endpointName, requestConfig);

		return this.requestService.request(requestPayload);
	}
}