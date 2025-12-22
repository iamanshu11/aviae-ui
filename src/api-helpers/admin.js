const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:3000/api/v1';

// Admin Authentication Functions
export const adminLogin = async (adminKey) => {
  try {
    // Verify admin key by attempting to fetch pharmacists list
    const response = await fetch(`${API_BASE_URL}/admin/pharmacists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Invalid admin credentials');
    }

    // Store admin key in localStorage
    setAdminToken(adminKey);
    return { success: true };
  } catch (error) {
    console.error('Admin Login Error:', error);
    return { success: false, error: error.message || 'Invalid admin credentials' };
  }
};

export const setAdminToken = (adminKey) => {
  localStorage.setItem('adminToken', adminKey);
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

export const adminLogout = () => {
  localStorage.removeItem('adminToken');
};

// Pharmacist Management Functions
export const createPharmacist = async (pharmacistData) => {
  try {
    const adminKey = getAdminToken();
    
    if (!adminKey) {
      throw new Error('Admin authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/pharmacists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      credentials: 'include',
      body: JSON.stringify(pharmacistData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create pharmacist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating pharmacist:', error);
    throw error;
  }
};

export const getPharmacists = async () => {
  try {
    const adminKey = getAdminToken();
    
    if (!adminKey) {
      throw new Error('Admin authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/pharmacists`, {
      method: 'GET',
      headers: {
        'x-admin-key': adminKey,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pharmacists');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pharmacists:', error);
    throw error;
  }
};