/* eslint-disable @typescript-eslint/no-explicit-any */
import { environment } from "../config/enviroment";
import type { Proposta } from "../models/Proposta";
import { BaseService } from "./BaseService";

const API_PROPOSTA = environment.apiProposta;

export class PropostaService extends BaseService {
  
  static async listarComFiltro(proposta: any): Promise<Proposta[]> {
    const url = `${API_PROPOSTA}/ObterTodosComFiltro?dataCriacao=${proposta.dataCriacao}&numeroProposta=${proposta.numeroProposta}&status=${proposta.codigoStatus}`;

    return this.request<Proposta[]>(url);
  }

  static async listar(): Promise<Proposta[]> {
    return this.request<Proposta[]>(
      `${API_PROPOSTA}/ObterDadosPropostaCliente`,
    );
  }

  static async obterPorId(id: number): Promise<Proposta> {
    return this.request<Proposta>(
      `${API_PROPOSTA}/ObterPropostaClientePorId/${id}`,
    );
  }

  static async criar(proposta: any): Promise<Proposta> {
    return this.request<Proposta>(`${API_PROPOSTA}/Novo`, "post", proposta);
  }

  static async atualizar(proposta: any): Promise<Proposta> {
    return this.request<Proposta>(
      `${API_PROPOSTA}/Atualizar/`,
      "put",
      proposta,
    );
  }

  static async salvar(apolice: any, isEdit: boolean): Promise<Proposta> {
    if (isEdit) return await this.atualizar(apolice);
    else return await this.criar(apolice);
  }
}
