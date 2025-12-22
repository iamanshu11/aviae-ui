import { getAuthToken } from "./login";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:3000/api/v1";

/**
 * Get metadata for a specific condition
 */
export const getMetadata = async (conditionSlug) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info('Frontend: GET /api/v1/conditions/:slug/metadata - request', { conditionSlug });

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
      console.info('Frontend: GET /api/v1/conditions/:slug/metadata - response', { status: response.status, error: err?.message });
      throw new Error(err?.message || "Failed to fetch metadata");
    }

    const data = await response.json();
    console.info('Frontend: GET /api/v1/conditions/:slug/metadata - response', { status: response.status, symptoms: data.symptoms_list?.length, red_flags: data.red_flags?.length, medications: data.medications?.length });

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

    console.info('Frontend: POST /api/v1/consultations/init - request', { payload });

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
      console.info('Frontend: POST /api/v1/consultations/init - response', { status: res.status, error: data?.message });
      throw new Error(data?.message || "Init failed");
    }

    console.info('Frontend: POST /api/v1/consultations/init - response', { status: res.status, consultation_id: data.consultation_id, consultation_ref: data.consultation_ref });

    return { success: true, data };
  } catch (err) {
    console.error("Init Consultation Error:", err);
    return { success: false, error: err.message };
  }
};

export const updateSymptoms = async (consultationId, payload) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info('Frontend: PUT /api/v1/consultations/:id/symptoms - request', { consultationId, payload });

    const res = await fetch(`${API_BASE_URL}/consultations/${consultationId}/symptoms`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.info('Frontend: PUT /api/v1/consultations/:id/symptoms - response', { status: res.status, error: data?.message });
      throw new Error(data?.message || "Update symptoms failed");
    }

    console.info('Frontend: PUT /api/v1/consultations/:id/symptoms - response', { status: res.status, success: true });
    return { success: true, data };
  } catch (err) {
    console.error('Update Symptoms Error:', err);
    return { success: false, error: err.message };
  }
};
