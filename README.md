# Moni

**Moni** es una aplicación web full-stack para la gestión de gastos personales. Permite registrar ingresos y gastos, organizarlos por categorías, controlar presupuestos mensuales, visualizar indicadores financieros en un dashboard y generar reportes exportables en CSV.

El proyecto fue desarrollado con una arquitectura separada en frontend, backend y base de datos, usando React, Node.js, Express y SQL Server.

---

## Características principales

* Registro e inicio de sesión de usuarios.
* Autenticación mediante JWT.
* Protección de rutas privadas.
* Recuperación de contraseña mediante token temporal.
* Gestión de categorías de ingresos y gastos.
* Registro de movimientos financieros.
* Edición y eliminación lógica de registros.
* Dashboard financiero con KPIs y gráficos.
* Presupuestos mensuales por categoría de gasto.
* Alertas visuales al superar el presupuesto.
* Reportes mensuales filtrables.
* Exportación de reportes en CSV.
* Sidebar reutilizable con navegación activa.
* Modal reutilizable para confirmaciones.
* Interfaz web responsive.

---

## Tecnologías utilizadas

### Frontend

* React
* TypeScript
* Vite
* React Router DOM
* Axios
* Recharts
* CSS

### Backend

* Node.js
* Express
* SQL Server
* JWT
* BcryptJS
* Dotenv
* CORS

### Base de datos

* SQL Server
* Schemas separados:

  * `auth`
  * `finance`

---

## Módulos del sistema

### 1. Autenticación

Permite registrar usuarios, iniciar sesión, mantener sesiones mediante JWT y recuperar contraseña mediante enlaces temporales.

Endpoints principales:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

### 2. Categorías

Permite crear, listar, editar y eliminar categorías financieras del usuario autenticado.

Cada categoría puede ser de tipo:

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

### 3. Movimientos financieros

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

### 4. Dashboard financiero

Muestra indicadores y gráficos financieros basados en los movimientos registrados.

Incluye:

* Ingresos del mes.
* Gastos del mes.
* Balance mensual.
* Categoría con mayor gasto.
* Gráfico de gastos por categoría.
* Gráfico de ingresos vs gastos.
* Evolución diaria de gastos.
* Filtro por mes y año.

Endpoints principales:

```text
GET /api/dashboard/resumen
GET /api/dashboard/gastos-por-categoria
GET /api/dashboard/ingresos-vs-gastos
GET /api/dashboard/evolucion-gastos
```

---

### 5. Presupuestos mensuales

Permite definir presupuestos por categoría de gasto en un mes específico.

El sistema calcula automáticamente:

* Monto presupuestado.
* Monto gastado.
* Monto disponible.
* Porcentaje usado.
* Alerta visual si se supera el presupuesto.

Endpoints principales:

```text
GET    /api/presupuestos
GET    /api/presupuestos/:id
POST   /api/presupuestos
PUT    /api/presupuestos/:id
DELETE /api/presupuestos/:id
```

---

### 6. Reportes mensuales

Permite consultar movimientos financieros por mes, año y tipo.

Filtros disponibles:

```text
TODOS
INGRESO
GASTO
```

También permite exportar los movimientos del periodo en formato CSV.

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
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
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

Antes de ejecutar el proyecto, se necesita tener instalado:

* Node.js
* npm
* SQL Server
* SQL Server Management Studio
* Git

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/enleam/Moni.git
cd Moni
```

---

## Configuración de la base de datos

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

Este script debe crear los schemas y tablas principales:

```text
auth.Usuario
auth.TokenRecuperacionPassword
finance.Categoria
finance.Movimiento
finance.PresupuestoMensual
```

---

## Configuración del backend

Ingresa a la carpeta del backend:

```bash
cd backend
npm install
```

El comando `npm install` instalará las dependencias necesarias del backend, como:

```text
express
cors
dotenv
mssql
bcryptjs
jsonwebtoken
nodemon
```

Crea un archivo `.env` dentro de la carpeta `backend`, tomando como base el archivo `.env.example`.

Ejemplo:

```env
PORT=3000

DB_USER=sa
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_DATABASE=FinTrackPersonalDB
DB_PORT=1433

JWT_SECRET=tu_jwt_secret_seguro
JWT_EXPIRES_IN=8h

FRONTEND_URL=http://localhost:5173
PASSWORD_RESET_EXPIRES_MINUTES=30
MAIL_MODE=dev
```

Ejecuta el backend:

```bash
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

---

## Configuración del frontend

En otra terminal, ingresa a la carpeta del frontend:

```bash
cd frontend
npm install
```

El comando `npm install` instalará las dependencias necesarias del frontend, como:

```text
react
react-dom
react-router-dom
axios
recharts
vite
typescript
```

Crea un archivo `.env` dentro de la carpeta `frontend`, tomando como base el archivo `.env.example`.

Ejemplo:

```env
VITE_API_URL=http://localhost:3000/api
```

Ejecuta el frontend:

```bash
npm run dev
```

El frontend estará disponible en:

```text
http://localhost:5173
```

---

## Variables de entorno

### Backend

Archivo:

```text
backend/.env.example
```

Contenido sugerido:

```env
PORT=3000

DB_USER=tu_usuario_sql
DB_PASSWORD=tu_password_sql
DB_SERVER=localhost
DB_DATABASE=FinTrackPersonalDB
DB_PORT=1433

JWT_SECRET=tu_jwt_secret_seguro
JWT_EXPIRES_IN=8h

FRONTEND_URL=http://localhost:5173
PASSWORD_RESET_EXPIRES_MINUTES=30
MAIL_MODE=dev
```

### Frontend

Archivo:

```text
frontend/.env.example
```

Contenido sugerido:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Recuperación de contraseña

En modo desarrollo, Moni genera un enlace de recuperación y lo devuelve directamente en la respuesta del backend.

Ejemplo de respuesta:

```json
{
  "mensaje": "Si el correo existe, se generó un enlace de recuperación.",
  "resetLink": "http://localhost:5173/reset-password/token"
}
```

Luego el usuario ingresa al enlace, escribe una nueva contraseña y el sistema actualiza el `password_hash`.

En producción, este flujo puede adaptarse para enviar el enlace por correo electrónico usando Gmail, SMTP o un proveedor de correo transaccional.

---

## Flujo principal de uso

```text
1. El usuario crea una cuenta.
2. Inicia sesión.
3. Crea categorías de ingreso y gasto.
4. Registra movimientos financieros.
5. Visualiza el dashboard mensual.
6. Define presupuestos por categoría.
7. Consulta reportes filtrables.
8. Exporta los reportes en CSV.
```

---

## Capturas del sistema

### Login

![Login](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/login.PNG)

### Registro de usuario

![Registro](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/registro.PNG)

### Recuperación de contraseña

![Recuperación de contraseña](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/recuperacion-password.PNG)

### Dashboard financiero

![Dashboard](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/dashboard.PNG)

### Gestión de categorías

![Categorías](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/categorias.PNG)

### Gestión de movimientos

![Movimientos](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/movimientos.PNG)

### Presupuestos mensuales

![Presupuestos](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/presupuestos.PNG)

### Reportes mensuales

![Reportes](https://raw.githubusercontent.com/enleam/Moni/main/docs/screenshots/reportes.PNG)

---

## Seguridad implementada

* Contraseñas almacenadas con hash usando BcryptJS.
* Autenticación mediante JWT.
* Rutas privadas protegidas con middleware.
* Separación de datos por usuario autenticado.
* Recuperación de contraseña mediante token temporal.
* Tokens de recuperación almacenados como hash.
* Expiración de enlaces de recuperación.
* Invalidación de tokens antiguos al generar uno nuevo.

---

## Consideraciones técnicas

* Las eliminaciones se manejan mediante baja lógica usando el campo `activo`.
* Cada usuario solo puede acceder a sus propios datos.
* Los presupuestos solo pueden asociarse a categorías de tipo `GASTO`.
* El dashboard respeta los filtros de mes y año.
* Los reportes pueden filtrarse por `TODOS`, `INGRESO` o `GASTO`.
* El archivo `.env` no debe subirse al repositorio.
* Los archivos `.env.example` sí se incluyen para documentar la configuración necesaria.

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

---

## Estado del proyecto

MVP completado.

Funcionalidades implementadas:

* Autenticación.
* Recuperación de contraseña.
* CRUD de categorías.
* CRUD de movimientos financieros.
* Dashboard financiero.
* Presupuestos mensuales.
* Reportes mensuales.
* Exportación CSV.
* Modal reutilizable de confirmación.
* Sidebar con opción activa.
* Interfaz visual mejorada.

---

## Próximas mejoras

* Envío real de correos para recuperación de contraseña.
* Despliegue del frontend en Vercel.
* Despliegue del backend en Render.
* Migración de base de datos local a Azure SQL Database.
* Dockerización del proyecto.
* Exportación de reportes en PDF.
* Modo oscuro.
* Mejoras responsive para móviles.
* Filtros avanzados por rango de fechas.
* Perfil de usuario editable.

---

## Autor

**Flavio Enrique Huapaya Bohorquez**

Estudiante de Ingeniería de Sistemas  
Universidad Nacional Mayor de San Marcos

---

## Licencia

Este proyecto se desarrolla con fines educativos y de portafolio.