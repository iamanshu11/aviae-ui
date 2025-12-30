const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginAPI = async (gphc_number, password) => {
  try {
    console.info('Frontend: POST /api/v1/auth/login - request', { gphc_number });
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ gphc_number, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Invalid credentials" }));
      console.info('Frontend: POST /api/v1/auth/login - response', { status: response.status, error: errorData.message });
      throw new Error(errorData.message || "Invalid credentials");
    }

    const data = await response.json();
    // Avoid logging tokens in full, just confirm presence
    console.info('Frontend: POST /api/v1/auth/login - response', { status: response.status, user: data.user ? { id: data.user.id, name: data.user.name } : null, token_present: !!data.token });
    return { success: true, data };
  } catch (error) {
    console.error("Login API Error:", error);
    
    // Provide more specific error messages
    if (error.message.includes("Failed to fetch")) {
      // Check for SSL certificate errors
      if (error.message.includes("ERR_CERT") || error.message.includes("certificate")) {
        return { 
          success: false, 
          error: "SSL certificate error. Please visit https://localhost:3000 in your browser first and accept the certificate, then try again." 
        };
      }
      
      if (error.message.includes("ERR_INVALID_HTTP_RESPONSE")) {
        return { 
          success: false, 
          error: "Unable to connect to server. Please check if the server is running on https://localhost:3000" 
        };
      }
      
      return { 
        success: false, 
        error: "Unable to connect to server. Please check if the server is running on https://localhost:3000" 
      };
    }
    
    return { success: false, error: error.message || "Login failed. Please try again." };
  }
};


export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};
