import { getAuthToken } from "./login";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:3000/api/v1";

/**
 * ─────────────────────────────────────────────
 * STEP 0: Get metadata for a condition
 * GET /conditions/:slug/metadata
 * ─────────────────────────────────────────────
 */
export const getMetadata = async (conditionSlug) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: GET /api/v1/conditions/:slug/metadata - request",
      { conditionSlug }
    );

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
      console.info(
        "Frontend: GET /api/v1/conditions/:slug/metadata - response",
        { status: response.status, error: err?.message }
      );
      throw new Error(err?.message || "Failed to fetch metadata");
    }

    const data = await response.json();

    console.info(
      "Frontend: GET /api/v1/conditions/:slug/metadata - response",
      {
        status: response.status,
        symptoms: data.symptoms_list?.length,
        red_flags: data.red_flags?.length,
        medications: data.medications?.length,
      }
    );

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
 * ─────────────────────────────────────────────
 * STEP 0.5: Initialize consultation
 * POST /consultations/init
 * ─────────────────────────────────────────────
 */
export const callInit = async (payload) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: POST /api/v1/consultations/init - request",
      { payload }
    );

    const res = await fetch(`${API_BASE_URL}/consultations/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.info(
        "Frontend: POST /api/v1/consultations/init - response",
        { status: res.status, error: data?.message }
      );
      throw new Error(data?.message || "Init failed");
    }

    console.info(
      "Frontend: POST /api/v1/consultations/init - response",
      {
        status: res.status,
        consultation_id: data.consultation_id,
        consultation_ref: data.consultation_ref,
      }
    );

    return { success: true, data };
  } catch (err) {
    console.error("Init Consultation Error:", err);
    return { success: false, error: err.message };
  }
};

/**
 * ─────────────────────────────────────────────
 * STEP 1: Update symptoms
 * PUT /consultations/:id/symptoms
 * ─────────────────────────────────────────────
 */
export const updateSymptoms = async (consultationId, payload) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: PUT /api/v1/consultations/:id/symptoms - request",
      { consultationId, payload }
    );

    const res = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}/symptoms`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.info(
        "Frontend: PUT /api/v1/consultations/:id/symptoms - response",
        { status: res.status, error: data?.message }
      );
      throw new Error(data?.message || "Update symptoms failed");
    }

    console.info(
      "Frontend: PUT /api/v1/consultations/:id/symptoms - response",
      { status: res.status, success: true }
    );

    return { success: true, data };
  } catch (err) {
    console.error("Update Symptoms Error:", err);
    return { success: false, error: err.message };
  }
};

/**
 * ─────────────────────────────────────────────
 * STEP 2: Update red flags
 * PUT /consultations/:id/red-flags
 * ─────────────────────────────────────────────
 */
export const updateRedFlags = async (consultationId, payload) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: PUT /api/v1/consultations/:id/red-flags - request",
      { consultationId, payload }
    );

    const res = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}/red-flags`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.info(
        "Frontend: PUT /api/v1/consultations/:id/red-flags - response",
        { status: res.status, error: data?.message }
      );
      throw new Error(data?.message || "Update red flags failed");
    }

    console.info(
      "Frontend: PUT /api/v1/consultations/:id/red-flags - response",
      { status: res.status, success: true }
    );

    return { success: true, data };
  } catch (err) {
    console.error("Update Red Flags Error:", err);
    return { success: false, error: err.message };
  }
};

/**
 * ─────────────────────────────────────────────
 * STEP 3: Update exam findings
 * PUT /consultations/:id/exam
 * ─────────────────────────────────────────────
 */
export const updateExam = async (consultationId, payload) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: PUT /api/v1/consultations/:id/exam - request",
      { consultationId, payload }
    );

    const res = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}/exam`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.info(
        "Frontend: PUT /api/v1/consultations/:id/exam - response",
        { status: res.status, error: data?.message }
      );
      throw new Error(data?.message || "Update exam failed");
    }

    console.info(
      "Frontend: PUT /api/v1/consultations/:id/exam - response",
      { status: res.status, success: true }
    );

    return { success: true, data };
  } catch (err) {
    console.error("Update Exam Error:", err);
    return { success: false, error: err.message };
  }
};

/**
 * ─────────────────────────────────────────────
 * STEP 4: Update history
 * PUT /consultations/:id/history
 * ─────────────────────────────────────────────
 */
export const updateHistory = async (consultationId, payload) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: PUT /api/v1/consultations/:id/history - request",
      { consultationId, payload }
    );

    const res = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}/history`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.info(
        "Frontend: PUT /api/v1/consultations/:id/history - response",
        { status: res.status, error: data?.message }
      );
      throw new Error(data?.message || "Update history failed");
    }

    console.info(
      "Frontend: PUT /api/v1/consultations/:id/history - response",
      { status: res.status, success: true }
    );

    return { success: true, data };
  } catch (err) {
    console.error("Update History Error:", err);
    return { success: false, error: err.message };
  }
};

/**
 * ─────────────────────────────────────────────
 * STEP 5: Get consultation outcome
 * GET /consultations/:id/outcome
 * ─────────────────────────────────────────────
 */
export const getOutcome = async (consultationId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: GET /api/v1/consultations/:id/outcome - request",
      { consultationId }
    );

    const res = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}/outcome`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.info(
        "Frontend: GET /api/v1/consultations/:id/outcome - response",
        { status: res.status, error: data?.message }
      );
      throw new Error(data?.message || "Failed to fetch outcome");
    }

    console.info(
      "Frontend: GET /api/v1/consultations/:id/outcome - response",
      { status: res.status, outcome: data }
    );

    return { success: true, data };
  } catch (err) {
    console.error("Get Outcome Error:", err);
    return { success: false, error: err.message };
  }
};

/**
 * ─────────────────────────────────────────────
 * STEP 6: Finalize consultation
 * POST /consultations/:id/finalize
 * ─────────────────────────────────────────────
 */
export const finalizeConsultation = async (consultationId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: POST /api/v1/consultations/:id/finalize - request",
      { consultationId }
    );

    const res = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}/finalize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.info(
        "Frontend: POST /api/v1/consultations/:id/finalize - response",
        { status: res.status, error: data?.message }
      );
      throw new Error(data?.message || "Finalize consultation failed");
    }

    console.info(
      "Frontend: POST /api/v1/consultations/:id/finalize - response",
      { status: res.status, success: true }
    );

    return { success: true, data };
  } catch (err) {
    console.error("Finalize Consultation Error:", err);
    return { success: false, error: err.message };
  }
};

/**
 * ─────────────────────────────────────────────
 * STEP 7: Get SOAP note
 * GET /consultations/:id/soap
 * ─────────────────────────────────────────────
 */
export const getSoapNote = async (consultationId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: GET /api/v1/consultations/:id/soap - request",
      { consultationId }
    );

    const res = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}/soap`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.info(
        "Frontend: GET /api/v1/consultations/:id/soap - response",
        { status: res.status, error: data?.message }
      );
      throw new Error(data?.message || "Failed to fetch SOAP note");
    }

    console.info(
      "Frontend: GET /api/v1/consultations/:id/soap - response",
      { status: res.status }
    );

    return { success: true, data };
  } catch (err) {
    console.error("Get SOAP Note Error:", err);
    return { success: false, error: err.message };
  }
};
