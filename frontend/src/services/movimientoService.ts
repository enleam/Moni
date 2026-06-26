import apiClient from '../api/apiClient';

export type TipoMovimiento = 'INGRESO' | 'GASTO';

export interface Movimiento {
  movimiento_id: number;
  usuario_id: number;
  categoria_id: number;
  categoria_nombre: string;
  categoria_color: string | null;
  tipo: TipoMovimiento;
  monto: number;
  fecha: string;
  descripcion: string | null;
  metodo_pago: string | null;
  activo: boolean;
  fecha_registro: string;
}

export interface MovimientoFormData {
  categoria_id: number;
  tipo: TipoMovimiento;
  monto: number;
  fecha: string;
  descripcion?: string;
  metodo_pago?: string;
}

export const listarMovimientos = async (): Promise<Movimiento[]> => {
  const response = await apiClient.get('/movimientos');
  return response.data.movimientos;
};

export const crearMovimiento = async (
  data: MovimientoFormData
): Promise<Movimiento> => {
  const response = await apiClient.post('/movimientos', data);
  return response.data.movimiento;
};

export const actualizarMovimiento = async (
  movimiento_id: number,
  data: MovimientoFormData
): Promise<Movimiento> => {
  const response = await apiClient.put(
    `/movimientos/${movimiento_id}`,
    data
  );

  return response.data.movimiento;
};

export const eliminarMovimiento = async (
  movimiento_id: number
): Promise<Movimiento> => {
  const response = await apiClient.delete(`/movimientos/${movimiento_id}`);
  return response.data.movimiento;
};