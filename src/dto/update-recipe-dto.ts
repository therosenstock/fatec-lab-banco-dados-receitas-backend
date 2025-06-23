export type UpdateRecipeDto = {
  titulo: string;
  tempo_preparo: string;
  categoria: string;
  ingredientes?: {
    descricao: string;
    quantidade: number;
    medida: string;
  }[];
  instrucoes?: {
    posicao: number;
    descricao: string;
  }[]
}
