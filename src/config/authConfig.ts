export const oidcConfig = {
  authority: "https://localhost:5001",
  client_id: "react",
  redirect_uri: "https://localhost:5173/callback",
  post_logout_redirect_uri: "https://localhost:5173",
  response_type: "code",
  scope: "openid profile roles api1",
  automaticSilentRenew: true,
};