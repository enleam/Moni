import apiClient from '../api/apiClient';

export type TipoReporte = 'TODOS' | 'INGRESO' | 'GASTO';

export interface ReporteResumen {
  total_ingresos: number;
  total_gastos: number;
  balance: number;
  cantidad_movimientos: number;
  promedio_movimiento: number;
  mayor_movimiento: number;
  menor_movimiento: number;
}

export interface ReporteMovimiento {
  movimiento_id: number;
  fecha: string;
  tipo: 'INGRESO' | 'GASTO';
  categoria: string;
  categoria_color: string | null;
  monto: number;
  metodo_pago: string | null;
  descripcion: string | null;
  fecha_registro: string;
}

export interface ReporteCategoria {
  categoria: string;
  tipo: 'INGRESO' | 'GASTO';
  total: number;
  cantidad: number;
}

export interface ReporteMensual {
  filtros: {
    anio: number;
    mes: number;
    tipo: TipoReporte;
  };
  resumen: ReporteResumen;
  movimientos: ReporteMovimiento[];
  totales_por_categoria: ReporteCategoria[];
}

export const obtenerReporteMensual = async (
  anio: number,
  mes: number,
  tipo: TipoReporte
): Promise<ReporteMensual> => {
  const response = await apiClient.get('/reportes/mensual', {
    params: {
      anio,
      mes,
      tipo
    }
  });

  return {
    filtros: response.data.filtros,
    resumen: response.data.resumen,
    movimientos: response.data.movimientos,
    totales_por_categoria: response.data.totales_por_categoria
  };
};