// Arquivo mantido para evitar quebras em imports existentes que ainda não foram migrados
// TODO: Remover este arquivo após migração completa

export interface SDUIScreen {
  id: string;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: any[];
}
