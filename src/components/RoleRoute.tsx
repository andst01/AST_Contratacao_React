/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

type RoleRouteProps = {
  roles: string[];
  children: JSX.Element;
};

export default function RoleRoute({ roles, children }: RoleRouteProps) {
 const auth = useAuth();

  if (!auth.isAuthenticated) return <Navigate to="/" />;

  let userRoles = auth.user?.profile?.role as string | string[] | undefined;

  if (!userRoles) userRoles = [];
  if (!Array.isArray(userRoles)) userRoles = [userRoles];

  const hasRole = roles.some(r => userRoles.includes(r));

  return hasRole ? children : <Navigate to="/acesso-negado" />;
  
}