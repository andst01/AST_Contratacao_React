import { environment } from "../config/enviroment";
import type { Cliente } from "../models/Cliente";
import { BaseService } from "./BaseService";

const API_CLIENTE = environment.apiCliente;

export class ClienteService extends BaseService {

  static async listar(): Promise<Cliente[]> {
    return this.request<Cliente[]>(`${API_CLIENTE}/ObterTodos`);
  }
  
}
