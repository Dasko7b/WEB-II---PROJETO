package br.com.webdois.backend_web_api.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "manuntecao")
public class Manuntencao {
    @Id
    @GeneratedValue
    private Long id_manutencao;

    @ManyToOne
    @JoinColumn(name = "idf-funcionario")
    private Usuario idf_funcionarioAtual;


    @ManyToOne
    @JoinColumn(name = "idf-solicitacao")
    private Solicitacao idf_solicitacao;

    private LocalDateTime dataHora;

    public Solicitacao getIdf_solicitacao() {
        return this.idf_solicitacao;
    }

    public void setIdf_solicitacao(Solicitacao idf_solicitacao) {
        this.idf_solicitacao = idf_solicitacao;
    }


    public Long getId_manutencao() {
        return this.id_manutencao;
    }

    public void setId_manutencao(Long id_manutencao) {
        this.id_manutencao = id_manutencao;
    }

    public Usuario getIdf_funcionarioAtual() {
        return this.idf_funcionarioAtual;
    }

    public void setIdf_funcionarioAtual(Usuario idf_funcionarioAtual) {
        this.idf_funcionarioAtual = idf_funcionarioAtual;
    }

    public LocalDateTime getDataHora() {
        return this.dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }



}
