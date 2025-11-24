import { solicitacaoModel } from "./solicitacaoModel";

export interface Orcamento {
  valorOrcamento: any;
  id: number;
  dataCriacao: String;
  valorTotal: number;
  estadoOrcamento: 'APROVADO' | 'REPROVADO' | 'INICIADO' | String;
  solicitacao: solicitacaoModel;
}