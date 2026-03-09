import { environment } from "../config/enviroment";
import type { Cliente } from "../models/Cliente";

const API_CLIENTE = environment.apiCliente;

export class ClienteService {
  static async listar(): Promise<Cliente[]> {

    const url = `${API_CLIENTE}/ObterTodos`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar apólices");
    }

    return response.json();
  }
  
}
