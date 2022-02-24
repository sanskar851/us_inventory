import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL || 'https://us-inventory.herokuapp.com';

const axiosInstance = axios.create({
	baseURL: baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default axiosInstance;
