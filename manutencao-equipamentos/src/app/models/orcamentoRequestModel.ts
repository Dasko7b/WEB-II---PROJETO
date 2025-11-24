export interface OrcamentoRequest {
  solicitacaoId: number;        
  usuarioId: number;        
  funcionarioId: number;     
  desc_Solicitacao: string; 
  valorOrcamento: number;     
}

export interface OrcamentoResponse {
  id: number;
  solicitacaoId: number;
  valorOrcamento: number;
  funcionarioId: number;
  usuarioId: number;
  estado: string;
  descricao: string;
}