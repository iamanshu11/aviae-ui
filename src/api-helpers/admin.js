const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:3000/api/v1";

const ADMIN_TOKEN_STORAGE = "admin_token";
export const adminLoginAPI = async (credentials) => {
  try {
    console.info('Frontend: Admin login started');
    // credentials can be a string (admin_key) or an object { username, password } or { admin_key }
    const body = typeof credentials === 'string' ? { admin_key: credentials } : credentials || {};
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const txt = await response.text().catch(() => 'Invalid credentials');
      throw new Error(txt || 'Invalid credentials');
    }
    const payload = await response.json();
    if (!payload.token) throw new Error('No token returned');
    localStorage.setItem(ADMIN_TOKEN_STORAGE, payload.token);
    console.info('Frontend: Admin token stored');
    return { success: true, user: payload.user || null };
  } catch (error) {
    console.error('Admin Login Error:', error);
    return { success: false, error: error.message };
  }
};

export const adminLogout = () => {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE);
};

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_STORAGE);
export const isAdminAuthenticated = () => !!getAdminToken();

/* ---------------- INTERNAL HELPER ---------------- */

const getAdminHeaders = () => {
  const token = getAdminToken();
  if (!token) throw new Error('Admin not authenticated');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
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
