import axios from 'axios'

const defaultRequestConfig =  (headers={}) => ({
	method: 'GET',
	url: '',
	params: null,
	data: null,
	headers: {
		'Content-Type': 'application/json',
		...headers
	},
})

class RequestService {
	constructor() {}

	isAccessTokenExist() {
		return !!this._accessToken;
	};

	setAccessToken(accessToken) {
		this._accessToken = accessToken;
	};

	request(options) {
		const requestConfig = {
			...defaultRequestConfig({ 'Authorization': `${this._accessToken}` }),
			...options
		};

		return new Promise((resolve, reject) => {
			axios(requestConfig)
				.then((res) => {
					resolve(res.data)
				})
				.catch((error) => {
					reject(error)
				})
		})
	};
}

let requestServiceInstance = null;
function getRequestServiceInstance() {
	if (!requestServiceInstance) {
		requestServiceInstance = new RequestService();
	}

	return requestServiceInstance;
}

export default getRequestServiceInstance;
