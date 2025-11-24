package br.com.webdois.backend_web_api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.webdois.backend_web_api.dtos.OrcamentoRequestDTO;
import br.com.webdois.backend_web_api.dtos.OrcamentoResponseDTO;
import br.com.webdois.backend_web_api.entity.EstadoChamado;
import br.com.webdois.backend_web_api.entity.EstadoOrcamento;
import br.com.webdois.backend_web_api.entity.Orcamento;
import br.com.webdois.backend_web_api.entity.Solicitacao;
import br.com.webdois.backend_web_api.entity.Usuario;
import br.com.webdois.backend_web_api.repository.OrcamentoRepository;
import br.com.webdois.backend_web_api.repository.SolicitacaoRepository;
import br.com.webdois.backend_web_api.repository.UsuarioRepository;

@Service
public class OrcamentoService {
        @Autowired
        private SolicitacaoRepository solicitacaoRepository;

        @Autowired
        private OrcamentoRepository orcamentoRepository;

        @Autowired
        private UsuarioRepository usuarioRepository;

        public Orcamento criarOrcamento(OrcamentoRequestDTO dto) {
                Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
                Usuario funcionario = usuarioRepository.findById(dto.getFuncionarioId())
                                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

                Solicitacao solicitacao = solicitacaoRepository.findById(dto.getSolicitaoId())
                                .orElseThrow(() -> new RuntimeException("Solicitação não encontrado"));

                Orcamento orcamento = new Orcamento();
                orcamento.setSolicitacao(solicitacao);
                orcamento.setFuncionario(funcionario);
                orcamento.setUsuario(usuario);

                orcamento.setData_orcamento(LocalDateTime.now());
                orcamento.setDesc_Solicitacao(dto.getDesc_Solicitacao());
                orcamento.setValorOrcamento(dto.getValorOrcamento());

                orcamento.setEstadoOrcamento(EstadoOrcamento.PENDENTE);

                solicitacao.setEstadoChamado(EstadoChamado.ORCADO);
                solicitacaoRepository.save(solicitacao);

                return orcamentoRepository.save(orcamento);
        }

        public OrcamentoResponseDTO toDTO(Orcamento orcamento) {
                OrcamentoResponseDTO dto = new OrcamentoResponseDTO();

                dto.setIdOrcamento(orcamento.getId());

                dto.setSolicitacaoId(orcamento.getSolicitacao().getId());

                dto.setUsuarioId(orcamento.getUsuario().getId());
                dto.setUsuarioNome(orcamento.getUsuario().getNome());

                dto.setFuncionarioId(orcamento.getFuncionario().getId());
                dto.setFuncionarioNome(orcamento.getFuncionario().getNome());

                dto.setDescSolicitacao(orcamento.getDesc_Solicitacao());
                dto.setDataOrcamento(orcamento.getData_orcamento());
                dto.setValorOrcamento(orcamento.getValorOrcamento());

                dto.setEstadoOrcamento(orcamento.getEstadoOrcamento());
                return dto;
        }

        public List<OrcamentoResponseDTO> listarOrcamentosPorCliente(Long usuarioId) {
                List<Orcamento> orcamentos = orcamentoRepository.findByUsuarioId(usuarioId);

                return orcamentos.stream()
                                .map(this::toDTO)
                                .collect(Collectors.toList());
        }

        public OrcamentoResponseDTO aprovarOrcamento(Long id) {
                Orcamento orcamento = orcamentoRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));

                orcamento.setEstadoOrcamento(EstadoOrcamento.APROVADO);
                Orcamento orcamentoSalvo = orcamentoRepository.save(orcamento);

                // Atualiza o estado da Solicitação 
                Solicitacao solicitacao = orcamentoSalvo.getSolicitacao();
                solicitacao.setEstadoChamado(EstadoChamado.EM_ANDAMENTO); 
                solicitacaoRepository.save(solicitacao);

                return toDTO(orcamentoSalvo);
        }

        public OrcamentoResponseDTO rejeitarOrcamento(Long id) {
                Orcamento orcamento = orcamentoRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Orçamento não encontrado"));

                orcamento.setEstadoOrcamento(EstadoOrcamento.REJEITADO); 
                Orcamento orcamentoSalvo = orcamentoRepository.save(orcamento);

                Solicitacao solicitacao = orcamentoSalvo.getSolicitacao();
                solicitacao.setEstadoChamado(EstadoChamado.REJEITADA); 
                solicitacaoRepository.save(solicitacao);

               return toDTO(orcamentoSalvo);
        }

        public List<OrcamentoResponseDTO> listarOrcamentosPorSolicitacao(Long solicitacaoId) {
                List<Orcamento> orcamentos = orcamentoRepository.findBySolicitacaoId(solicitacaoId);

                return orcamentos.stream().map(this::toDTO).collect(Collectors.toList());
        }
}