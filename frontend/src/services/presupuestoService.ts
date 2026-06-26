import apiClient from '../api/apiClient';

export interface Presupuesto {
  presupuesto_id: number;
  usuario_id: number;
  categoria_id: number;
  categoria_nombre: string;
  categoria_color: string | null;
  anio: number;
  mes: number;
  monto_presupuestado: number;
  monto_gastado: number;
  monto_disponible: number;
  porcentaje_usado: number;
  activo: boolean;
  fecha_registro: string;
}

export interface PresupuestoFormData {
  categoria_id: number;
  anio: number;
  mes: number;
  monto_presupuestado: number;
}

export const listarPresupuestos = async (
  anio: number,
  mes: number
): Promise<Presupuesto[]> => {
  const response = await apiClient.get('/presupuestos', {
    params: { anio, mes }
  });

  return response.data.presupuestos;
};

export const crearPresupuesto = async (
  data: PresupuestoFormData
): Promise<Presupuesto> => {
  const response = await apiClient.post('/presupuestos', data);
  return response.data.presupuesto;
};

export const actualizarPresupuesto = async (
  presupuesto_id: number,
  data: PresupuestoFormData
): Promise<Presupuesto> => {
  const response = await apiClient.put(
    `/presupuestos/${presupuesto_id}`,
    data
  );

  return response.data.presupuesto;
};

export const eliminarPresupuesto = async (
  presupuesto_id: number
): Promise<Presupuesto> => {
  const response = await apiClient.delete(
    `/presupuestos/${presupuesto_id}`
  );

  return response.data.presupuesto;
};