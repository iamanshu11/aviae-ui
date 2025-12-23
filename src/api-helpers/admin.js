const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:3000/api/v1";

const ADMIN_KEY_STORAGE = "admin_key";

/* ---------------- ADMIN AUTH ---------------- */

export const adminLoginAPI = async (admin_key) => {
  try {
    console.info("Frontend: Admin key validation started");

    const response = await fetch(
      `${API_BASE_URL}/admin/consultations`,
      {
        method: "GET",
        headers: {
          "x-admin-key": admin_key,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Invalid admin key");
    }

    localStorage.setItem(ADMIN_KEY_STORAGE, admin_key);

    console.info("Frontend: Admin key validated successfully");
    return { success: true };
  } catch (error) {
    console.error("Admin Login Error:", error);
    return { success: false, error: error.message };
  }
};

export const adminLogout = () => {
  localStorage.removeItem(ADMIN_KEY_STORAGE);
};

export const getAdminKey = () => localStorage.getItem(ADMIN_KEY_STORAGE);
export const isAdminAuthenticated = () => !!getAdminKey();

/* ---------------- INTERNAL HELPER ---------------- */

const getAdminHeaders = () => {
  const adminKey = getAdminKey();
  if (!adminKey) throw new Error("Admin not authenticated");
  return {
    "Content-Type": "application/json",
    "x-admin-key": adminKey,
  };
};

/* ---------------- ADMIN DATA APIS ---------------- */

// Pharmacists
export const createPharmacistAPI = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/admin/pharmacists`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create pharmacist");
  return res.json();
};

export const listPharmacistsAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/pharmacists`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch pharmacists");
  return res.json();
};

// Symptoms
export const listSymptomsAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/symptoms`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch symptoms");
  return res.json();
};

// Medications
export const listMedicationsAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/medications`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch medications");
  return res.json();
};

// Red Flags
export const listRedFlagsAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/red-flags`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch red flags");
  return res.json();
};

// Consultations
export const listConsultationsAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/consultations`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch consultations");
  return res.json();
};
