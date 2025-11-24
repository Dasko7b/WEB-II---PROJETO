package br.com.webdois.backend_web_api.entity;

public enum EstadoChamado {
    ABERTO,//COMEÇA EM ABERTO
    EM_ANDAMENTO,//APOS FUNCIONARIO INICIAR MANUNTENCAO
    CONCLUIDO,//APOS MANUNTENCAO ESTAR CONCLUIDA
    CANCELADO, 
    REJEITADA,
    ORCADO
}