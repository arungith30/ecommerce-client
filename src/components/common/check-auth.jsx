/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  const isAuthRoute =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isShopRoute = location.pathname.startsWith("/shop");

  // Logging for debugging purposes
  console.log(
    `Path: ${location.pathname}, Authenticated: ${isAuthenticated}, Role: ${user?.role}`
  );

  // Redirect unauthenticated users to login, except for login/register routes
  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect authenticated users away from login/register
  if (isAuthenticated && isAuthRoute) {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  // Restrict admin routes to admins only
  if (isAdminRoute) {
    if (!isAuthenticated || user?.role !== "admin") {
      return <Navigate to="/unauth-page" replace />;
    }
  }

  // Restrict shop routes for non-admin users
  if (isShopRoute && isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Handle root path based on user role
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}

export default CheckAuth;
