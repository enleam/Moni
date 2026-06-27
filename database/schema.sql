CREATE DATABASE FinTrackPersonalDB;
GO

USE FinTrackPersonalDB;
GO

CREATE SCHEMA auth;
GO

CREATE SCHEMA finance;
GO

CREATE TABLE auth.Usuario (
    usuario_id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    correo NVARCHAR(150) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    fecha_registro DATETIME2 DEFAULT SYSDATETIME(),
    activo BIT DEFAULT 1
);
GO

IF NOT EXISTS (
    SELECT * FROM sys.schemas WHERE name = 'finance'
)
BEGIN
    EXEC('CREATE SCHEMA finance');
END
GO

IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'finance'
      AND TABLE_NAME = 'Categoria'
)
BEGIN
    CREATE TABLE finance.Categoria (
        categoria_id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        nombre NVARCHAR(100) NOT NULL,
        tipo NVARCHAR(20) NOT NULL,
        color NVARCHAR(20) NULL,
        activo BIT DEFAULT 1,
        fecha_registro DATETIME2 DEFAULT SYSDATETIME(),

        CONSTRAINT FK_Categoria_Usuario
        FOREIGN KEY (usuario_id) REFERENCES auth.Usuario(usuario_id),

        CONSTRAINT CK_Categoria_Tipo
        CHECK (tipo IN ('INGRESO', 'GASTO'))
    );
END
GO

--Prueba
SELECT * FROM finance.Categoria;

IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'finance'
      AND TABLE_NAME = 'Movimiento'
)
BEGIN
    CREATE TABLE finance.Movimiento (
        movimiento_id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        categoria_id INT NOT NULL,
        tipo NVARCHAR(20) NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        fecha DATE NOT NULL,
        descripcion NVARCHAR(250) NULL,
        metodo_pago NVARCHAR(50) NULL,
        activo BIT DEFAULT 1,
        fecha_registro DATETIME2 DEFAULT SYSDATETIME(),

        CONSTRAINT FK_Movimiento_Usuario
        FOREIGN KEY (usuario_id) REFERENCES auth.Usuario(usuario_id),

        CONSTRAINT FK_Movimiento_Categoria
        FOREIGN KEY (categoria_id) REFERENCES finance.Categoria(categoria_id),

        CONSTRAINT CK_Movimiento_Tipo
        CHECK (tipo IN ('INGRESO', 'GASTO')),

        CONSTRAINT CK_Movimiento_Monto
        CHECK (monto > 0)
    );
END
GO

--Prueba
SELECT * FROM finance.Movimiento;

SELECT 
    m.movimiento_id,
    u.nombre AS usuario,
    c.nombre AS categoria,
    m.tipo,
    m.monto,
    m.fecha,
    m.descripcion,
    m.metodo_pago,
    m.activo,
    m.fecha_registro
FROM finance.Movimiento m
INNER JOIN auth.Usuario u
    ON m.usuario_id = u.usuario_id
INNER JOIN finance.Categoria c
    ON m.categoria_id = c.categoria_id
ORDER BY m.movimiento_id DESC;

IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'finance'
      AND TABLE_NAME = 'PresupuestoMensual'
)
BEGIN
    CREATE TABLE finance.PresupuestoMensual (
        presupuesto_id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        categoria_id INT NOT NULL,
        anio INT NOT NULL,
        mes INT NOT NULL,
        monto_presupuestado DECIMAL(10,2) NOT NULL,
        activo BIT DEFAULT 1,
        fecha_registro DATETIME2 DEFAULT SYSDATETIME(),

        CONSTRAINT FK_Presupuesto_Usuario
        FOREIGN KEY (usuario_id) REFERENCES auth.Usuario(usuario_id),

        CONSTRAINT FK_Presupuesto_Categoria
        FOREIGN KEY (categoria_id) REFERENCES finance.Categoria(categoria_id),

        CONSTRAINT CK_Presupuesto_Mes
        CHECK (mes BETWEEN 1 AND 12),

        CONSTRAINT CK_Presupuesto_Anio
        CHECK (anio >= 2000),

        CONSTRAINT CK_Presupuesto_Monto
        CHECK (monto_presupuestado > 0),

        CONSTRAINT UQ_Presupuesto_Usuario_Categoria_Periodo
        UNIQUE (usuario_id, categoria_id, anio, mes)
    );
END
GO

--Prueba
SELECT * FROM finance.PresupuestoMensual;

SELECT 
    p.presupuesto_id,
    u.nombre AS usuario,
    c.nombre AS categoria,
    p.anio,
    p.mes,
    p.monto_presupuestado,
    p.activo,
    p.fecha_registro
FROM finance.PresupuestoMensual p
INNER JOIN auth.Usuario u
    ON p.usuario_id = u.usuario_id
INNER JOIN finance.Categoria c
    ON p.categoria_id = c.categoria_id
ORDER BY p.presupuesto_id DESC;

SELECT 
    presupuesto_id,
    usuario_id,
    categoria_id,
    anio,
    mes,
    monto_presupuestado,
    activo
FROM finance.PresupuestoMensual
ORDER BY presupuesto_id DESC;

IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'auth'
      AND TABLE_NAME = 'TokenRecuperacionPassword'
)
BEGIN
    CREATE TABLE auth.TokenRecuperacionPassword (
        token_id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        token_hash NVARCHAR(255) NOT NULL,
        fecha_expiracion DATETIME2 NOT NULL,
        usado BIT DEFAULT 0,
        fecha_registro DATETIME2 DEFAULT SYSDATETIME(),

        CONSTRAINT FK_TokenRecuperacion_Usuario
        FOREIGN KEY (usuario_id) REFERENCES auth.Usuario(usuario_id)
    );
END
GO

--Prueba
SELECT 
    token_id,
    usuario_id,
    fecha_expiracion,
    usado,
    fecha_registro
FROM auth.TokenRecuperacionPassword
ORDER BY token_id DESC;