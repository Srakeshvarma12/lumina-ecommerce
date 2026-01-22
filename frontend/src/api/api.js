const BASE_URL = process.env.REACT_APP_API_URL;

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    },
    body: options.body ? options.body : undefined // ✅ DO NOT stringify here
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};

export const authRequest = (endpoint, options) =>
  apiRequest(endpoint, options);

export const adminRequest = (endpoint, options) =>
  apiRequest(`/admin${endpoint}`, options);
