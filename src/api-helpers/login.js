const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export const loginAPI = async (gphc_number, password) => {
  try {
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
      throw new Error(errorData.message || "Invalid credentials");
    }

    const data = await response.json();
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
