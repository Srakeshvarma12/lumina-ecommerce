const BASE_URL = "https://lumina-ecommerce-tuil.onrender.com/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    },
    body: options.body ? options.body : undefined
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error(data?.error || "Request failed");
    error.status = res.status;
    throw error;
  }

  return data;
};

/* 🔐 AUTH */
export const authRequest = async (endpoint, options = {}) => {
  return apiRequest(endpoint, options);
};

/* 🛡️ ADMIN */
export const adminRequest = async (endpoint, options = {}) => {
  return apiRequest(`/admin${endpoint}`, options);
};
