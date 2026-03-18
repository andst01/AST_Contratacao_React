import { useAuth } from "react-oidc-context";

export default function useAuthCustom() {
  const auth = useAuth();

  const isAuthenticated = auth.isAuthenticated;

  const login = () => auth.signinRedirect();
  const logout = () => auth.signoutRedirect();

  return {
    ...auth,
    isAuthenticated,
    login,
    logout,
  };
}