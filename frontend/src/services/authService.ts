import apiClient from '../api/apiClient';

export interface Usuario {
  usuario_id: number;
  nombre: string;
  correo: string;
  fecha_registro?: string;
  activo?: boolean;
}

export interface AuthResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

export interface RegistroData {
  nombre: string;
  correo: string;
  password: string;
}

export interface LoginData {
  correo: string;
  password: string;
}

export const registrarUsuario = async (
  data: RegistroData
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const iniciarSesion = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const obtenerPerfil = async (): Promise<Usuario> => {
  const response = await apiClient.get('/auth/me');
  return response.data.usuario;
};

export const guardarSesion = (token: string, usuario: Usuario) => {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
};

export const obtenerUsuarioLocal = (): Usuario | null => {
  const usuario = localStorage.getItem('usuario');

  if (!usuario) {
    return null;
  }

  return JSON.parse(usuario);
};

export const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};