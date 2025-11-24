import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavComponent } from '../../../shared/Nav/nav';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { OrcamentoService } from '../../../services/orcamentoService';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class Servicos {

  orcamentoSelecionado: any; 

  // Modals
  isModalVisible: boolean = false;
  isRejectionModalVisible: boolean = false;
  isRejectionConfirmationVisible: boolean = false;

  // Dados vindos da API
  solicitacaoId!: number;
  orcamento!: any;

  // Campos de exibição
  rejectionReason: string = '';
  approvalMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orcamentoService: OrcamentoService
  ) {}

  ngOnInit(): void {
    this.solicitacaoId = Number(this.route.snapshot.paramMap.get("id"));
    this.carregarOrcamento();
  }

  // ---------------------------------------------------
  // 🟦 CARREGAR ÚLTIMO ORÇAMENTO DA SOLICITAÇÃO
  // ---------------------------------------------------
  carregarOrcamento() {
    this.orcamentoService.listarPorSolicitacao(this.solicitacaoId).subscribe({
      next: (lista) => {
        if (lista.length === 0) {
          alert("Nenhum orçamento foi registrado para esta solicitação.");
          return;
        }

        this.orcamento = lista[lista.length - 1]; // pega o último orçamento

        this.approvalMessage = `Serviço aprovado por R$ ${this.orcamento.valorOrcamento.toFixed(2)}`;
      },
      error: (err) => {
        console.error("Erro ao carregar orçamentos:", err);
        alert("Erro ao carregar orçamento.");
      }
    });
  }

  // ---------------------------------------------------
  // 🟩 APROVAÇÃO
  // ---------------------------------------------------
  openApprovalModal(): void {
    this.isModalVisible = true;
  }

  confirmApproval(): void {
    this.orcamentoService.aprovarOrcamento(this.orcamento.id).subscribe({
      next: () => {
        alert("Orçamento aprovado!");
        this.router.navigate(['/cliente']);
      },
      error: (err) => console.error("Erro:", err)
    });
  }

  // ---------------------------------------------------
  // 🟥 REJEIÇÃO
  // ---------------------------------------------------
  openRejectionModal(): void {
    this.rejectionReason = '';
    this.isRejectionModalVisible = true;
  }

  closeRejectionModal(): void {
    this.isRejectionModalVisible = false;
  }

  confirmRejection(): void {
    this.orcamentoService.rejeitarOrcamento(this.orcamento.id).subscribe({
      next: () => {
        this.isRejectionModalVisible = false;
        this.isRejectionConfirmationVisible = true;
      },
      error: (err) => console.error("Erro:", err)
    });
  }

  closeRejectionConfirmation(): void {
    this.isRejectionConfirmationVisible = false;
    this.router.navigate(['/cliente']);
  }
}
