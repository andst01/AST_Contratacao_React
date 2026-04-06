/* eslint-disable @typescript-eslint/no-explicit-any */

import { oidcConfig } from "../config/authConfig";

export class BaseService {
  protected static async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: any,
  ): Promise<T> {
    
    const oidcData = sessionStorage.getItem(
      `oidc.user:${oidcConfig.authority}:${oidcConfig.client_id}`,
    );

    let token = null;
    if (oidcData) {
      const user = JSON.parse(oidcData);
      token = user.access_token; // É aqui que o token real reside
    }

   
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok)
      throw new Error(`Erro na requisição: ${response.statusText}`);

    return response.json();
  }
}
