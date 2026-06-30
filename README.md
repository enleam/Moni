# Moni

**Moni** es una aplicación web full-stack para la gestión de finanzas personales. Permite registrar ingresos y gastos, organizar movimientos por categorías, controlar presupuestos mensuales, definir metas de ahorro, visualizar indicadores financieros y generar reportes exportables.

El proyecto fue desarrollado como una aplicación separada en **frontend**, **backend** y **base de datos**, usando React, Node.js, Express y SQL Server.

---

## Descripción general

Moni busca ayudar al usuario a tener mayor control sobre su dinero mediante una interfaz simple, moderna y organizada.

El sistema permite:

- Registrar ingresos y gastos.
- Clasificar movimientos por categorías.
- Visualizar un resumen financiero mensual.
- Controlar presupuestos por categoría.
- Crear metas de ahorro.
- Consultar reportes mensuales.
- Exportar información en CSV.
- Gestionar el perfil del usuario.
- Recuperar contraseña mediante correo.
- Verificar el correo electrónico al registrarse.

---

## Características principales

- Homepage pública de presentación.
- Registro de usuarios.
- Verificación de correo electrónico mediante Gmail.
- Inicio de sesión con JWT.
- Recuperación de contraseña mediante enlace enviado por correo.
- Protección de rutas privadas.
- Gestión de categorías de ingresos y gastos.
- Registro de movimientos financieros.
- Edición y eliminación lógica de registros.
- Resumen financiero con KPIs y gráficos.
- Presupuestos mensuales por categoría.
- Alertas visuales al superar presupuestos.
- Metas de ahorro con barra de progreso.
- Reportes mensuales filtrables.
- Exportación de reportes en CSV.
- Perfil de usuario editable.
- Cambio de contraseña desde el perfil.
- Sidebar reutilizable con navegación activa.
- Modal reutilizable para confirmaciones.
- Diseño responsive.
- Logo y favicon personalizado.

---

## Tecnologías utilizadas

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- Recharts
- CSS

### Backend

- Node.js
- Express
- SQL Server
- JWT
- BcryptJS
- Nodemailer
- Dotenv
- CORS

### Base de datos

- SQL Server
- SQL Server Management Studio
- Azure SQL Database para despliegue

Schemas utilizados:

```text
auth
finance
```

---

## Módulos del sistema

### 1. Homepage pública

Pantalla inicial de presentación de la aplicación.

Incluye:

- Descripción de Moni.
- Botones para iniciar sesión y registrarse.
- Sección de características.
- Sección de beneficios.
- Sección de contacto.
- Footer con información del proyecto.

---

### 2. Autenticación

Permite registrar usuarios, iniciar sesión, proteger rutas privadas y mantener la sesión mediante JWT.

Funcionalidades:

- Registro de usuario.
- Verificación de correo.
- Inicio de sesión.
- Recuperación de contraseña.
- Restablecimiento de contraseña.
- Cierre de sesión.

Endpoints principales:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/verify-email/:token
```

---

### 3. Perfil de usuario

Permite al usuario consultar y actualizar sus datos personales.

Funcionalidades:

- Ver nombre.
- Ver correo.
- Ver fecha de registro.
- Editar nombre.
- Cambiar contraseña.

Endpoints principales:

```text
GET /api/perfil
PUT /api/perfil
PUT /api/perfil/password
```

---

### 4. Categorías

Permite crear, listar, editar y eliminar categorías financieras.

Tipos disponibles:

```text
INGRESO
GASTO
```

Endpoints principales:

```text
GET    /api/categorias
GET    /api/categorias/:id
POST   /api/categorias
PUT    /api/categorias/:id
DELETE /api/categorias/:id
```

---

### 5. Movimientos financieros

Permite registrar ingresos y gastos con categoría, monto, fecha, descripción y método de pago.

Métodos de pago considerados:

```text
Efectivo
Tarjeta
Transferencia
Yape/Plin
```

Endpoints principales:

```text
GET    /api/movimientos
GET    /api/movimientos/:id
POST   /api/movimientos
PUT    /api/movimientos/:id
DELETE /api/movimientos/:id
```

---

### 6. Resumen financiero

Muestra indicadores y gráficos financieros basados en los movimientos registrados.

Incluye:

- Ingresos del mes.
- Gastos del mes.
- Balance mensual.
- Categoría con mayor gasto.
- Gráfico de gastos por categoría.
- Gráfico de ingresos vs gastos.
- Evolución diaria de gastos.
- Filtro por mes y año.

Endpoints principales:

```text
GET /api/dashboard/resumen
GET /api/dashboard/gastos-por-categoria
GET /api/dashboard/ingresos-vs-gastos
GET /api/dashboard/evolucion-gastos
```

---

### 7. Presupuestos mensuales

Permite definir presupuestos por categoría de gasto para un mes específico.

El sistema calcula:

- Monto presupuestado.
- Monto gastado.
- Monto disponible.
- Porcentaje usado.
- Estado del presupuesto.
- Alerta visual si se supera el límite.

Endpoints principales:

```text
GET    /api/presupuestos
GET    /api/presupuestos/:id
POST   /api/presupuestos
PUT    /api/presupuestos/:id
DELETE /api/presupuestos/:id
```

---

### 8. Metas de ahorro

Permite crear objetivos de ahorro y registrar avances.

Funcionalidades:

- Crear meta.
- Editar meta.
- Eliminar meta.
- Registrar avance.
- Ver porcentaje de progreso.
- Marcar como completada automáticamente.

Endpoints principales:

```text
GET    /api/metas
GET    /api/metas/:id
POST   /api/metas
PUT    /api/metas/:id
PATCH  /api/metas/:id/avance
DELETE /api/metas/:id
```

---

### 9. Reportes mensuales

Permite consultar movimientos financieros por mes, año y tipo.

Filtros disponibles:

```text
TODOS
INGRESO
GASTO
```

También permite exportar reportes en formato CSV.

Endpoint principal:

```text
GET /api/reportes/mensual
```

Ejemplo:

```text
GET /api/reportes/mensual?anio=2026&mes=6&tipo=TODOS
```

---

## Estructura del proyecto

```text
Moni/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.ts
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   └── schema.sql
│
├── docs/
│   └── screenshots/
│
├── .gitignore
└── README.md
```

---

## Requisitos previos

Para ejecutar el proyecto localmente se necesita:

- Node.js
- npm
- SQL Server
- SQL Server Management Studio
- Git

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/enleam/Moni.git
cd Moni
```

---

## Configuración de base de datos

El proyecto utiliza SQL Server.

Primero crea la base de datos:

```sql
CREATE DATABASE FinTrackPersonalDB;
GO
```

Luego ejecuta el script ubicado en:

```text
database/schema.sql
```

El script crea los schemas y tablas principales del sistema.

Tablas principales:

```text
auth.Usuario
auth.TokenRecuperacionPassword
auth.TokenVerificacionEmail
finance.Categoria
finance.Movimiento
finance.PresupuestoMensual
finance.MetaAhorro
```

---

## Configuración del backend

Ingresar a la carpeta del backend:

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de la carpeta `backend`, tomando como referencia `.env.example`.

Ejemplo de variables:

```env
PORT=3000

DB_USER=tu_usuario_sql
DB_PASSWORD=tu_password_sql
DB_SERVER=localhost
DB_DATABASE=FinTrackPersonalDB
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

JWT_SECRET=tu_jwt_secret_seguro
JWT_EXPIRES_IN=8h

FRONTEND_URL=http://localhost:5173
PASSWORD_RESET_EXPIRES_MINUTES=30
EMAIL_VERIFICATION_EXPIRES_MINUTES=60

MAIL_MODE=dev

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_password_de_aplicacion
MAIL_FROM_NAME=Moni
MAIL_FROM_EMAIL=tu_correo@gmail.com

CORS_ORIGINS=http://localhost:5173
```

Ejecutar backend:

```bash
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

---

## Configuración del frontend

Ingresar a la carpeta del frontend:

```bash
cd frontend
npm install
```

Crear un archivo `.env` dentro de la carpeta `frontend`, tomando como referencia `.env.example`.

Ejemplo:

```env
VITE_API_URL=http://localhost:3000/api
```

Ejecutar frontend:

```bash
npm run dev
```

El frontend estará disponible en:

```text
http://localhost:5173
```

---

## Variables de entorno

Los archivos `.env` reales no se suben al repositorio.

Solo se incluyen archivos `.env.example` para documentar qué variables necesita el proyecto.

### Backend

```text
backend/.env.example
```

### Frontend

```text
frontend/.env.example
```

Importante:

```text
Nunca subir claves reales, contraseñas, tokens, datos de Azure, contraseñas de aplicación de Gmail ni secretos JWT.
```

---

## Seguridad implementada

- Contraseñas almacenadas con hash usando BcryptJS.
- Autenticación mediante JWT.
- Rutas privadas protegidas con middleware.
- Separación de datos por usuario autenticado.
- Verificación de correo mediante token temporal.
- Recuperación de contraseña mediante token temporal.
- Tokens almacenados como hash.
- Expiración de enlaces de verificación y recuperación.
- Invalidación de tokens antiguos.
- Validación de propiedad de datos por usuario.
- Variables sensibles protegidas mediante `.env`.

---

## Flujo principal de uso

```text
1. El usuario entra a la homepage.
2. Crea una cuenta.
3. Recibe un correo de verificación.
4. Verifica su cuenta.
5. Inicia sesión.
6. Crea categorías de ingreso y gasto.
7. Registra movimientos financieros.
8. Visualiza el resumen mensual.
9. Define presupuestos por categoría.
10. Crea metas de ahorro.
11. Consulta reportes.
12. Exporta reportes en CSV.
```

---

## Capturas del sistema

### Homepage

![Homepage](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/home.PNG)

### Login

![Login](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/login.PNG)

### Registro de usuario

![Registro](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/registro.PNG)

### Verificación de correo

![Verificación de correo](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/verificacion-email.PNG)

### Recuperación de contraseña

![Recuperación de contraseña](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/recuperacion-password.PNG)

### Resumen financiero

![Resumen](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/dashboard.PNG)

### Gestión de categorías

![Categorías](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/categorias.PNG)

### Gestión de movimientos

![Movimientos](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/movimientos.PNG)

### Presupuestos mensuales

![Presupuestos](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/presupuestos.PNG)

### Metas de ahorro

![Metas](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/metas.PNG)

### Reportes mensuales

![Reportes](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/reportes.PNG)

### Perfil de usuario

![Perfil](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/perfil.PNG)

---

## Despliegue previsto

El despliegue del sistema se plantea con la siguiente arquitectura:

```text
Frontend: Vercel
Backend: Render
Base de datos: Azure SQL Database
```

---

## Consideraciones técnicas

- Las eliminaciones se manejan mediante baja lógica usando el campo `activo`.
- Cada usuario solo puede acceder a sus propios registros.
- Los presupuestos se asocian a categorías de tipo `GASTO`.
- Las metas se completan automáticamente al alcanzar el monto objetivo.
- El resumen financiero respeta filtros de mes y año.
- Los reportes pueden filtrarse por tipo de movimiento.
- El sistema usa interceptores de Axios para adjuntar el token JWT.
- El frontend maneja redirección automática si el token es inválido o expiró.

---

## Comandos útiles

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Git

```bash
git status
git add .
git commit -m "feat: actualizar documentacion de Moni"
git push
```

---

## Estado del proyecto

Versión 1.0 completada.

Funcionalidades implementadas:

- Homepage pública.
- Registro con verificación de correo.
- Login con JWT.
- Recuperación de contraseña por Gmail.
- CRUD de categorías.
- CRUD de movimientos financieros.
- Resumen financiero.
- Presupuestos mensuales.
- Metas de ahorro.
- Reportes mensuales.
- Exportación CSV.
- Perfil de usuario.
- Cambio de contraseña.
- Modal reutilizable de confirmación.
- Sidebar con navegación activa.
- Diseño responsive.
- Logo y favicon personalizado.

---

## Próximas mejoras

- Reportes en PDF.
- Modo oscuro.
- Filtros avanzados por rango de fechas.
- Cuentas bancarias o billeteras.
- Movimientos recurrentes.
- Notificaciones internas.
- Gráficos comparativos por periodos.
- Mejoras de accesibilidad.
- Pruebas automatizadas.
- Dockerización del proyecto.

---

## Autor

**Flavio Enrique Huapaya Bohorquez**

Estudiante de Ingeniería de Sistemas  
Universidad Nacional Mayor de San Marcos

---

## Uso y derechos

Este proyecto fue desarrollado con fines educativos y de portafolio.

No se autoriza el uso comercial, redistribución o publicación de copias derivadas sin autorización del autor.

© 2026 Moni. Todos los derechos reservados.