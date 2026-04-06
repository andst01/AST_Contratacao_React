/* eslint-disable @typescript-eslint/no-explicit-any */
export class BaseService {
  protected static async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: any,
  ): Promise<T> {
    //const token = localStorage.getItem("token");

    
    const oidcData = sessionStorage.getItem(
      "oidc.user:https://localhost:5001:react",
    );

    let token = null;
    if (oidcData) {
      const user = JSON.parse(oidcData);
      console.log(user);
      token = user.access_token; // É aqui que o token real reside
    }

    console.log("o token do identity server");
    console.log(token);

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(endpoint);

    if (!response.ok)
      throw new Error(`Erro na requisição: ${response.statusText}`);

    return response.json();
  }
}
