/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Apolice } from "../models/Apolice";
import { environment } from "../config/enviroment";
import { BaseService } from "./BaseService";

const API_APOLICE = environment.apiApolice;

export class ApoliceService extends BaseService {
  static async listarComFiltro(filtro: any): Promise<Apolice[]> {
    const url = `${API_APOLICE}/ObterTodosComFiltro?dataContratacao=${filtro.dataContratacao}&numeroApolice=${filtro.numeroApolice}&status=${filtro.codigoStatus}`;

    return this.request<Apolice[]>(url);
  }

  static async obterPorId(id: number): Promise<Apolice> {
    return this.request<Apolice>(
      `${API_APOLICE}/ObterContratacaoPropostaClientePorId/${id}`,
    );
  }

  static async criar(apolice: any): Promise<Apolice> {
    return this.request<Apolice>(`${API_APOLICE}/Novo`, "post", apolice);
  }

  static async atualizar(apolice: any): Promise<Apolice> {
    return this.request<Apolice>(`${API_APOLICE}/Atualizar`, "put", apolice);
  }

  static async salvar(apolice: any, isEdit: boolean): Promise<Apolice> {
    if (isEdit) return await this.atualizar(apolice);
    else return await this.criar(apolice);
  }
}
