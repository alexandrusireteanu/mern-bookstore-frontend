// frontend/src/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    products: `${API_BASE_URL}/api/products`,
    cart: `${API_BASE_URL}/api/cart`,
    cartItem: (id) => `${API_BASE_URL}/api/cart/${id}`,
    checkout: `${API_BASE_URL}/api/create-checkout-session`
  }
};

// Helper pentru a obține endpoint-uri
export const getEndpoint = (key, param) => {
  if (param && apiConfig.endpoints[key]) {
    return typeof apiConfig.endpoints[key] === 'function' 
      ? apiConfig.endpoints[key](param)
      : apiConfig.endpoints[key];
  }
  return apiConfig.endpoints[key] || API_BASE_URL;
};

export default apiConfig;