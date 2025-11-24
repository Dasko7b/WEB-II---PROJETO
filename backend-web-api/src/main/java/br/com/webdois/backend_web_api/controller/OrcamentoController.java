package br.com.webdois.backend_web_api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.webdois.backend_web_api.dtos.OrcamentoRequestDTO;
import br.com.webdois.backend_web_api.dtos.OrcamentoResponseDTO;
import br.com.webdois.backend_web_api.entity.Orcamento;
import br.com.webdois.backend_web_api.service.OrcamentoService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/Orcamentos")
@Tag(name = "Orçamentos")
public class OrcamentoController {

    @Autowired
    private OrcamentoService orcamentoService;

    @PostMapping
    public ResponseEntity<Orcamento> criarOrcamento(@RequestBody OrcamentoRequestDTO dto) {
        Orcamento orcamento = orcamentoService.criarOrcamento(dto);
        return ResponseEntity.ok(orcamento);
    }

    @GetMapping("/cliente/{id}")
    public List<OrcamentoResponseDTO> listarPorCliente(@PathVariable Long id) {
        return orcamentoService.listarOrcamentosPorCliente(id);
    }

    @PostMapping("/aprovar/{id_orcamento}")
    public ResponseEntity<OrcamentoResponseDTO> aprovarOrcamento(@PathVariable Long id_orcamento) {
        OrcamentoResponseDTO response = orcamentoService.aprovarOrcamento(id_orcamento);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/rejeitar/{id_orcamento}")
    
    public ResponseEntity<OrcamentoResponseDTO> rejeitarOrcamento(@PathVariable Long id_orcamento) {
    OrcamentoResponseDTO response = orcamentoService.rejeitarOrcamento(id_orcamento);
    return ResponseEntity.ok(response);
    }

    @GetMapping("/solicitacao/{solicitacaoId}")
    public ResponseEntity<List<OrcamentoResponseDTO>> listarPorSolicitacao(@PathVariable Long solicitacaoId) {
        List<OrcamentoResponseDTO> orcamentos = orcamentoService.listarOrcamentosPorSolicitacao(solicitacaoId);
        return ResponseEntity.ok(orcamentos);
    }
}
