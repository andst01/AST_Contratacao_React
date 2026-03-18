/* eslint-disable @typescript-eslint/no-explicit-any */

import { Outlet } from "react-router-dom";

import { useAuth } from "react-oidc-context";

export  function PrivateRoute() {
 const auth = useAuth();

  if (auth.isLoading) return <p>Carregando...</p>;

  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return null;
  }

  return <Outlet />;
}