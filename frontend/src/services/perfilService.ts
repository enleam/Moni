import apiClient from '../api/apiClient';

export interface PerfilUsuario {
  usuario_id: number;
  nombre: string;
  correo: string;
  fecha_registro: string;
  activo: boolean;
}

export interface ActualizarPerfilData {
  nombre: string;
}

export interface CambiarPasswordData {
  passwordActual: string;
  nuevaPassword: string;
}

export const obtenerPerfil = async (): Promise<PerfilUsuario> => {
  const response = await apiClient.get('/perfil');
  return response.data.perfil;
};

export const actualizarPerfil = async (
  data: ActualizarPerfilData
): Promise<PerfilUsuario> => {
  const response = await apiClient.put('/perfil', data);
  return response.data.perfil;
};

export const cambiarPassword = async (
  data: CambiarPasswordData
): Promise<{ mensaje: string }> => {
  const response = await apiClient.put('/perfil/password', data);
  return response.data;
};