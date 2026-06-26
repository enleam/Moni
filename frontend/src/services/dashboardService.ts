import apiClient from '../api/apiClient';

export interface DashboardResumen {
  total_ingresos: number;
  total_gastos: number;
  balance: number;
  cantidad_movimientos: number;
  categoria_mayor_gasto: string;
  total_categoria_mayor_gasto: number;
}

export interface GastoCategoria {
  categoria: string;
  color: string | null;
  total: number;
}

export interface IngresoVsGasto {
  periodo: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

export interface EvolucionGasto {
  fecha: string;
  total: number;
}

export const obtenerResumenDashboard = async (
  anio?: number,
  mes?: number
): Promise<DashboardResumen> => {
  const response = await apiClient.get('/dashboard/resumen', {
    params: { anio, mes }
  });

  return response.data.resumen;
};

export const obtenerGastosPorCategoria = async (
  anio?: number,
  mes?: number
): Promise<GastoCategoria[]> => {
  const response = await apiClient.get('/dashboard/gastos-por-categoria', {
    params: { anio, mes }
  });

  return response.data.gastos;
};

export const obtenerIngresosVsGastos = async (): Promise<IngresoVsGasto[]> => {
  const response = await apiClient.get('/dashboard/ingresos-vs-gastos');
  return response.data.datos;
};

export const obtenerEvolucionGastos = async (
  anio?: number,
  mes?: number
): Promise<EvolucionGasto[]> => {
  const response = await apiClient.get('/dashboard/evolucion-gastos', {
    params: { anio, mes }
  });

  return response.data.datos;
};