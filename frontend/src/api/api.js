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

  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Request failed");

  return data;
};

/* 🔐 AUTH REQUEST */
export const authRequest = async (endpoint, options = {}) => {
  return apiRequest(endpoint, options);
};

/* 🛡️ ADMIN REQUEST */
export const adminRequest = async (endpoint, options = {}) => {
  return apiRequest(`/admin${endpoint}`, options);
};
