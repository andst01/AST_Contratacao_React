import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export  function Callback() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      window.location.href = "/";
    }
  }, [auth.isAuthenticated]);

  if (auth.isLoading) {
    return <p>Autenticando...</p>;
  }

  if (auth.error) {
    return <p>Erro: {auth.error.message}</p>;
  }

  return <p>Processando login...</p>;

}