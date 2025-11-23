// src/app/models/categoria.ts

export class Categoria {
  id!: number;
  nome!: string;
  ativo!: boolean; // Para deleção lógica, conforme boas práticas.
}

// Se o Backend usa um DTO para request que tem apenas o nome:
export class CategoriaRequest {
  nome!: string;
}