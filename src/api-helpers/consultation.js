import { getAuthToken } from "./login";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

/**
 * Get metadata for a specific condition
 */
export const getMetadata = async (conditionSlug) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    const response = await fetch(
      `${API_BASE_URL}/conditions/${conditionSlug}/metadata`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || "Failed to fetch metadata");
    }

    const data = await response.json();

    return {
      success: true,
      data: {
        symptoms_list: data.symptoms_list || [],
        red_flags: data.red_flags || [],
        medications: data.medications || [],
        enums: data.enums || {},
        text_assets: data.text_assets || {},
      },
    };
  } catch (error) {
    console.error("Get Metadata Error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Initialize consultation (POST)
 */
export const callInit = async (payload) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    const res = await fetch(`${API_BASE_URL}/consultations/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include auth token
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Init failed");
    }

    return { success: true, data };
  } catch (err) {
    console.error("Init Consultation Error:", err);
    return { success: false, error: err.message };
  }
};
