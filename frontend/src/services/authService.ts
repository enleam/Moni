import apiClient from '../api/apiClient';

export interface Usuario {
  usuario_id: number;
  nombre: string;
  correo: string;
  fecha_registro?: string;
  activo?: boolean;
  email_verificado?: boolean;
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

export interface RegistroResponse {
  mensaje: string;
  verificationLink?: string;
}

export interface LoginData {
  correo: string;
  password: string;
}

export const registrarUsuario = async (
  data: RegistroData
): Promise<RegistroResponse> => {
  const response = await apiClient.post<RegistroResponse>(
    '/auth/register',
    data
  );

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

export const verificarEmail = async (
  token: string
): Promise<{ mensaje: string }> => {
  const response = await apiClient.get(`/auth/verify-email/${token}`);
  return response.data;
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

export interface ForgotPasswordResponse {
  mensaje: string;
  resetLink?: string;
}

export const solicitarRecuperacionPassword = async (
  correo: string
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    '/auth/forgot-password',
    { correo }
  );

  return response.data;
};

export const restablecerPassword = async ({
  token,
  nuevaPassword
}: {
  token: string;
  nuevaPassword: string;
}): Promise<{ mensaje: string }> => {
  const response = await apiClient.post('/auth/reset-password', {
    token,
    nuevaPassword
  });

  return response.data;
};