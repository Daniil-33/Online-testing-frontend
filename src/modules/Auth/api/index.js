import ApiService from '@/services/apiService';
import apiConfig from './config.js';

export default new ApiService(apiConfig, {
	allowUnauthorized: true,
});