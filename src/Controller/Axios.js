import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:9000';

const axiosInstance = axios.create({
	baseURL: baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default axiosInstance;
