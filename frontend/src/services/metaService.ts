import apiClient from '../api/apiClient';

export interface MetaAhorro {
  meta_id: number;
  usuario_id: number;
  nombre: string;
  descripcion: string | null;
  monto_objetivo: number;
  monto_actual: number;
  fecha_objetivo: string | null;
  estado: 'ACTIVA' | 'COMPLETADA';
  activo: boolean;
  fecha_registro: string;
}

export interface MetaAhorroForm {
  nombre: string;
  descripcion?: string;
  monto_objetivo: number;
  monto_actual: number;
  fecha_objetivo?: string;
}

export const listarMetas = async (): Promise<MetaAhorro[]> => {
  const response = await apiClient.get('/metas');
  return response.data.metas;
};

export const obtenerMeta = async (id: number): Promise<MetaAhorro> => {
  const response = await apiClient.get(`/metas/${id}`);
  return response.data.meta;
};

export const crearMeta = async (
  data: MetaAhorroForm
): Promise<MetaAhorro> => {
  const response = await apiClient.post('/metas', data);
  return response.data.meta;
};

export const actualizarMeta = async (
  id: number,
  data: MetaAhorroForm
): Promise<MetaAhorro> => {
  const response = await apiClient.put(`/metas/${id}`, data);
  return response.data.meta;
};

export const registrarAvanceMeta = async (
  id: number,
  monto_avance: number
): Promise<MetaAhorro> => {
  const response = await apiClient.patch(`/metas/${id}/avance`, {
    monto_avance
  });

  return response.data.meta;
};

export const eliminarMeta = async (id: number): Promise<void> => {
  await apiClient.delete(`/metas/${id}`);
};