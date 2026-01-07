const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserHeaders = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("User not authenticated");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const listConsultationRecordsAPI = async () => {
  const res = await fetch(`${API_BASE_URL}/consultations`, {
    headers: getUserHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch consultations");
  }

  const data = await res.json();
  return data.consultations || [];
};
