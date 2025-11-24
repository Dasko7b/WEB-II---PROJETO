import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orcamento } from '../models/OrcamentoModel';
import { OrcamentoRequest, OrcamentoResponse } from '../models/orcamentoRequestModel';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoService {
  

  http = inject(HttpClient);

  API = "http://localhost:8080/Orcamentos";

  constructor() { }

  criarOrcamento(orcamentoRequest: OrcamentoRequest): Observable<Orcamento> {
    return this.http.post<Orcamento>(this.API, orcamentoRequest);
  }

  listarPorCliente(clienteId: number): Observable<Orcamento[]> {
    return this.http.get<Orcamento[]>(`${this.API}/cliente/${clienteId}`);
  }
 
  listarPorSolicitacao(solicitacaoId: number): Observable<Orcamento[]> {
    return this.http.get<Orcamento[]>(`${this.API}/solicitacao/${solicitacaoId}`);
  }

  aprovarOrcamento(idOrcamento: number): Observable<OrcamentoResponse> {
    return this.http.patch<OrcamentoResponse>(`${this.API}/${idOrcamento}/aprovar`, {});
  }

  rejeitarOrcamento(idOrcamento: number): Observable<OrcamentoResponse> {
    return this.http.patch<OrcamentoResponse>(`${this.API}/${idOrcamento}/rejeitar`, {});
  }

}
