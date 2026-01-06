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

/**
 * ─────────────────────────────────────────────
 * Generate PDF from SOAP note
 * POST /consultations/:id/generate-pdf
 * ─────────────────────────────────────────────
 */
export const generatePDF = async (consultationId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: POST /api/v1/consultations/:id/generate-pdf - request",
      { consultationId }
    );

    const res = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}/generate-pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.info(
        "Frontend: POST /api/v1/consultations/:id/generate-pdf - response",
        { status: res.status, error: data?.error || data?.message }
      );
      // If PDF already exists (400 error), that's okay - continue to download
      if (res.status === 400 && data?.error?.includes("SOAP note not found")) {
        throw new Error(data.error || "SOAP note not found. Please generate SOAP note first.");
      }
      throw new Error(data?.error || data?.message || "Failed to generate PDF");
    }

    console.info(
      "Frontend: POST /api/v1/consultations/:id/generate-pdf - response",
      { status: res.status, filename: data?.filename }
    );

    return { success: true, data };
  } catch (err) {
    console.error("Generate PDF Error:", err);
    return { success: false, error: err.message };
  }
};

/**
 * ─────────────────────────────────────────────
 * Download PDF file
 * GET /consultations/:id/download-pdf
 * ─────────────────────────────────────────────
 */
export const downloadPDF = async (consultationId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");

    console.info(
      "Frontend: GET /api/v1/consultations/:id/download-pdf - request",
      { consultationId }
    );

    const res = await fetch(
      `${API_BASE_URL}/consultations/${consultationId}/download-pdf`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.info(
        "Frontend: GET /api/v1/consultations/:id/download-pdf - response",
        { status: res.status, error: errorData?.error || errorData?.message }
      );
      throw new Error(errorData?.error || errorData?.message || "Failed to download PDF");
    }

    // Get the blob
    const blob = await res.blob();
    
    // Extract filename from Content-Disposition header or use default
    const contentDisposition = res.headers.get("Content-Disposition");
    let filename = "consultation.pdf";
    if (contentDisposition) {
      // Match quoted filename: filename="example.pdf" or filename*=UTF-8''example.pdf
      // Use non-greedy match to stop at semicolon or end of string
      let filenameMatch = contentDisposition.match(/filename\*?=["']?([^"';]+?)["']?(?:;|$)/i);
      if (!filenameMatch) {
        // Try without quotes
        filenameMatch = contentDisposition.match(/filename\*?=([^;]+)/i);
      }
      if (filenameMatch && filenameMatch[1]) {
        let extractedFilename = filenameMatch[1].trim();
        // Handle RFC 5987 encoded filenames (filename*=UTF-8''example.pdf)
        if (extractedFilename.startsWith("UTF-8''")) {
          extractedFilename = decodeURIComponent(extractedFilename.substring(7));
        }
        // Remove any trailing underscores, spaces, or other unwanted characters FIRST
        extractedFilename = extractedFilename.trim().replace(/[_\s]+$/, '');
        
        // Extract base name and extension separately for better control
        const lastDotIndex = extractedFilename.lastIndexOf('.');
        if (lastDotIndex > 0) {
          // Has an extension
          let baseName = extractedFilename.substring(0, lastDotIndex);
          let extension = extractedFilename.substring(lastDotIndex).toLowerCase();
          
          // Clean base name - remove any remaining trailing underscores and spaces
          baseName = baseName.replace(/[_\s]+$/, '');
          
          // Ensure extension is .pdf
          extension = '.pdf';
          
          filename = baseName + extension;
        } else {
          // No extension, clean and add .pdf
          extractedFilename = extractedFilename.replace(/[_\s]+$/, '');
          filename = extractedFilename + '.pdf';
        }
      }
    }

    // Create download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    console.info(
      "Frontend: GET /api/v1/consultations/:id/download-pdf - response",
      { status: res.status, filename }
    );

    return { success: true, filename };
  } catch (err) {
    console.error("Download PDF Error:", err);
    return { success: false, error: err.message };
  }
};
