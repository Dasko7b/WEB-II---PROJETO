import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Panel } from '../../../shared/panel/panel';
import { NavComponent } from '../../../shared/Nav/nav';
import { TableChamado } from '../../../shared/table-chamado/table-chamado';
import { PainelAcoesFuncionario } from '../../../shared/painel-acoes-funcionario/painel-acoes-funcionario';
import { ModalComponent } from '../../../shared/novo-modal/novo-modal';
import { EfetuarOrcamento } from '../efetuar-orcamento/efetuar-orcamento';
import { SolicitacaoService } from '../../../services/solicitacao';
import { solicitacaoModel } from '../../../models/solicitacaoModel';

export interface Chamado {
  id: string;
  codigo: string;
  cliente: string;
  descricao: string;
  data_chamado: string;
  estado: string;
}

export enum Estados {
  ABERTA = 'ABERTA',
  ORCADA = 'ORÇADA',
  REJEITADA = 'REJEITADA',
  APROVADA = 'APROVADA',
  REDIRECIONADA = 'REDIRECIONADA',
  ARRUMADA = 'ARRUMADA',
  PAGA = 'PAGA',
  FINALIZADA = 'FINALIZADA'
}

@Component({
  selector: 'app-painel-funcinario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Panel,
    NavComponent,
    TableChamado,
    PainelAcoesFuncionario,
    ModalComponent,
    EfetuarOrcamento
  ],
  templateUrl: './painel-funcinario.html',
  styleUrl: './painel-funcinario.css'
})
export class PainelFuncinario implements OnInit {

  solicitacaoService = inject(SolicitacaoService);

  orcamentoModalVisible = false;
  selectedChamado: any = null;

  chamados: Chamado[] = [];           // Lista original vinda da API
  chamadosFiltrados: Chamado[] = [];   // Lista filtrada mostrada na tabela

  filtroEstado: Estados = Estados.ABERTA;
  estadosDisponiveis: Estados[] = Object.values(Estados);

  ngOnInit(): void {
    this.loadChamados();
  }

  loadChamados() {
    this.solicitacaoService.list().subscribe({
      next: (dados: solicitacaoModel[]) => {
        this.chamados = dados.map(item => ({
          id: item.id.toString(),
          codigo: item.id.toString(),
          cliente: item.usuario?.nome ?? '---',
          descricao: item.descricaoEquipamentos,
          data_chamado: item.dataHora.split('T')[0],
          estado: item.estadoChamado
        }));

        this.aplicarFiltro();
      },
      error: (err) => {
        console.error("Erro ao carregar solicitações", err);
      }
    });
  }

  onFiltroChange(): void {
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    this.chamadosFiltrados = this.chamados
      .filter(ch => ch.estado === this.filtroEstado)
      .map(ch => {
        const tratado = { ...ch };
        if (tratado.descricao.length > 27) {
          tratado.descricao = tratado.descricao.substring(0, 27) + "...";
        }
        return tratado;
      });
  }

  openOrcamentoModal(row: any) {
    this.orcamentoModalVisible = true;
    this.selectedChamado = row.id;
  }

  closeOrcamentoModal() {
    this.orcamentoModalVisible = false;
  }
}
