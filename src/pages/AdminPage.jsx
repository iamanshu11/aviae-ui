import { useState } from "react";
import { isAdminAuthenticated } from "../api-helpers/admin";
import AdminLoginView from "../views/admin/AdminLoginView";
import AdminDashboardView from "../views/admin/AdminDashboardView";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminAuthenticated());

  return (
    <>
      {isLoggedIn ? (
        <AdminDashboardView />
      ) : (
        <AdminLoginView onSuccess={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}
