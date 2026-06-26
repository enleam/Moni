import apiClient from '../api/apiClient';

export type TipoCategoria = 'INGRESO' | 'GASTO';

export interface Categoria {
  categoria_id: number;
  usuario_id: number;
  nombre: string;
  tipo: TipoCategoria;
  color: string | null;
  activo: boolean;
  fecha_registro: string;
}

export interface CategoriaFormData {
  nombre: string;
  tipo: TipoCategoria;
  color?: string;
}

export const listarCategorias = async (): Promise<Categoria[]> => {
  const response = await apiClient.get('/categorias');
  return response.data.categorias;
};

export const crearCategoria = async (
  data: CategoriaFormData
): Promise<Categoria> => {
  const response = await apiClient.post('/categorias', data);
  return response.data.categoria;
};

export const actualizarCategoria = async (
  categoria_id: number,
  data: CategoriaFormData
): Promise<Categoria> => {
  const response = await apiClient.put(
    `/categorias/${categoria_id}`,
    data
  );

  return response.data.categoria;
};

export const eliminarCategoria = async (
  categoria_id: number
): Promise<Categoria> => {
  const response = await apiClient.delete(`/categorias/${categoria_id}`);
  return response.data.categoria;
};