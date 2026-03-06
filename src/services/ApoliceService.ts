/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Apolice } from "../models/Apolice";
import { environment } from "../config/enviroment";

const API_APOLICE = environment.apiApolice;

export class ApoliceService {
  static async listarComFiltro(filtro: any): Promise<Apolice[]> {

    const url = `${API_APOLICE}/ObterTodosComFiltro?dataContratacao=${filtro.dataContratacao}&numeroApolice=${filtro.numeroApolice}&status=${filtro.codigoStatus}`;
    
    const response = await fetch(url, {
       method: 'GET',
       headers: { "Content-Type": "application/json" },
    });
    
    if (!response.ok) {
      throw new Error("Erro ao buscar apólices");
    }

    return response.json();
  }

  static async obterPorId(id: number): Promise<Apolice> {
    const response = await fetch(`${API_APOLICE}/ObterContratacaoPropostaClientePorId/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar apólices");
    }

    return response.json();
  }

  static async criar(apolice: any): Promise<Apolice> {
    const response = await fetch(`${API_APOLICE}/Novo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apolice),
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar apólices");
    }

    return response.json();
  }


  static async atualizar(apolice: any): Promise<Apolice> {
    const response = await fetch(`${API_APOLICE}/Atualizar/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apolice),
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar apólices");
    }

    return response.json();
  }

  static async salvar(apolice: any, isEdit: boolean) : Promise<Apolice> {
     if(isEdit)
      return await this.atualizar(apolice);
    else
      return await this.criar(apolice)
  }
  
}
