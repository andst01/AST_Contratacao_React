/* eslint-disable @typescript-eslint/no-explicit-any */
import { environment } from "../config/enviroment";
import type { Proposta } from "../models/Proposta";


const API_PROPOSTA = environment.apiProposta;

export class PropostaService{

     static async listarComFiltro(proposta: any) : Promise<Proposta[]>{

        const url = `${API_PROPOSTA}/ObterTodosComFiltro?dataCriacao=${proposta.dataCriacao}&numeroProposta=${proposta.numeroProposta}&status=${proposta.codigoStatus}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            
        });

        if(!response.ok){
            throw new Error("Erro ao buscar propostas");
        }

        return response.json();
    } 

    static async listar() : Promise<Proposta[]>{

        const response = await fetch(`${API_PROPOSTA}/ObterDadosPropostaCliente`);

        if(!response.ok){
            throw new Error("Erro ao buscar propostas");
        }

        return response.json();
    } 

    static async obterPorId(id: number) : Promise<Proposta>{

        const response = await fetch(`${API_PROPOSTA}/ObterPropostaClientePorId/${id}`);

        if(!response.ok){
            throw new Error("Erro ao buscar proposta");
        }

        return response.json();
    }
}