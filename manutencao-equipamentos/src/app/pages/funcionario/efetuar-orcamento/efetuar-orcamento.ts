import { Component, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrcamentoService } from '../../../services/orcamentoService';
import { OrcamentoRequest } from '../../../models/orcamentoRequestModel';
import { solicitacaoModel } from '../../../models/solicitacaoModel';
import { SolicitacaoService } from '../../../services/solicitacao';
import { LoginService } from '../../../services/loginService';

@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './efetuar-orcamento.html',
  styleUrls: ['./efetuar-orcamento.css'],
})
export class EfetuarOrcamento {
  
  solicitacaoId: number | null = null;
  solicitacao: solicitacaoModel | null = null;
  valorOrcamento: number | null = null; 
  descOrcamento: string = ''; 
  isLoading: boolean = true;

  funcionarioId: number | null = null; // agora inicializado

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitacaoService: SolicitacaoService,
    private orcamentoService: OrcamentoService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.funcionarioId = this.loginService.getFuncionarioId();

    if (!this.funcionarioId) {
      alert('Erro: funcionário não está logado.');
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.solicitacaoId = +id;
        this.carregarDadosSolicitacao(this.solicitacaoId);
      }
    });
  }

  carregarDadosSolicitacao(id: number): void {
    this.solicitacaoService.findById(id).subscribe({
      next: (data) => {
        this.solicitacao = data;
        this.isLoading = false;
        
        if (data.estadoChamado !== 'AGUARDANDO_ORCAMENTO') {
          alert('Esta solicitação não está aguardando orçamento.');
        }
      },
      error: (error) => {
        console.error('Erro ao carregar solicitação', error);
        alert('Não foi possível carregar os dados da solicitação.');
        this.isLoading = false;
      }
    });
  }

  efetuarOrcamento(): void {
    if (!this.solicitacaoId || this.valorOrcamento === null || this.valorOrcamento <= 0) {
      alert('Por favor, verifique o valor do orçamento.');
      return;
    }

    const orcamentoData: OrcamentoRequest = {
      solicitacaoId: this.solicitacaoId,
      valorOrcamento: this.valorOrcamento,
      usuarioId: this.solicitacao?.usuario.id || 0,
      funcionarioId: this.funcionarioId!,
      desc_Solicitacao: this.descOrcamento
    };

    this.orcamentoService.criarOrcamento(orcamentoData).subscribe({
      next: (response) => {
        alert(`Orçamento de R$ ${response.valorOrcamento} efetuado com sucesso!`);
        this.router.navigate(['/funcionario/painel']);
      },
      error: (err) => {
        console.error('Erro ao efetuar orçamento:', err);
        alert('Erro ao registrar o orçamento.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/funcionario/painel']);
  }
}
