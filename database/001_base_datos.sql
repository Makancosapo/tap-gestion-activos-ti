IF DB_ID('gestion_activos_ti') IS NOT NULL
BEGIN
    ALTER DATABASE gestion_activos_ti SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE gestion_activos_ti;
END;
GO

CREATE DATABASE gestion_activos_ti;
GO

USE gestion_activos_ti;
GO

/* =========================
   TABLAS MAESTRAS
   ========================= */

CREATE TABLE cargo (
    id_cargo INT IDENTITY(1,1) PRIMARY KEY,
    descripcion_cargo VARCHAR(100) NOT NULL UNIQUE
);
GO

CREATE TABLE estado_trabajador (
    id_estado_trabajador INT IDENTITY(1,1) PRIMARY KEY,
    descripcion_estado VARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE trabajador (
    id_trabajador INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    id_cargo INT NOT NULL,
    id_estado_trabajador INT NOT NULL,
    CONSTRAINT fk_trabajador_cargo
        FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo),
    CONSTRAINT fk_trabajador_estado
        FOREIGN KEY (id_estado_trabajador) REFERENCES estado_trabajador(id_estado_trabajador),
    CONSTRAINT uq_trabajador_nombre_apellido
        UNIQUE (nombre, apellido)
);
GO

CREATE TABLE categoria_producto (
    id_categoria INT IDENTITY(1,1) PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE
);
GO

CREATE TABLE producto (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    nombre_producto VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255) NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    id_categoria INT NOT NULL,
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria_producto(id_categoria)
);
GO

CREATE TABLE estado_equipo (
    id_estado_equipo INT IDENTITY(1,1) PRIMARY KEY,
    descripcion_estado VARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE equipo (
    id_equipo INT IDENTITY(1,1) PRIMARY KEY,
    id_producto INT NOT NULL,
    numero_serie VARCHAR(100) NOT NULL UNIQUE,
    codigo_interno VARCHAR(100) NOT NULL UNIQUE,
    fecha_ingreso DATE NOT NULL,
    id_estado_equipo INT NOT NULL,
    observacion VARCHAR(255) NULL,
    CONSTRAINT fk_equipo_producto
        FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    CONSTRAINT fk_equipo_estado
        FOREIGN KEY (id_estado_equipo) REFERENCES estado_equipo(id_estado_equipo),
    CONSTRAINT ck_equipo_fecha_ingreso
        CHECK (fecha_ingreso <= CAST(GETDATE() AS DATE))
);
GO

CREATE TABLE tipo_movimiento (
    id_tipo_movimiento INT IDENTITY(1,1) PRIMARY KEY,
    descripcion_tipo VARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE movimiento (
    id_movimiento INT IDENTITY(1,1) PRIMARY KEY,
    fecha_movimiento DATETIME NOT NULL DEFAULT GETDATE(),
    id_equipo INT NOT NULL,
    id_tipo_movimiento INT NOT NULL,
    id_trabajador_registra INT NOT NULL,
    id_trabajador_destino INT NULL,
    motivo VARCHAR(255) NULL,
    CONSTRAINT fk_movimiento_equipo
        FOREIGN KEY (id_equipo) REFERENCES equipo(id_equipo),
    CONSTRAINT fk_movimiento_tipo
        FOREIGN KEY (id_tipo_movimiento) REFERENCES tipo_movimiento(id_tipo_movimiento),
    CONSTRAINT fk_movimiento_registra
        FOREIGN KEY (id_trabajador_registra) REFERENCES trabajador(id_trabajador),
    CONSTRAINT fk_movimiento_destino
        FOREIGN KEY (id_trabajador_destino) REFERENCES trabajador(id_trabajador)
);
GO

CREATE TABLE asignacion_actual (
    id_equipo INT PRIMARY KEY,
    id_trabajador INT NOT NULL,
    fecha_asignacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_asignacion_equipo
        FOREIGN KEY (id_equipo) REFERENCES equipo(id_equipo),
    CONSTRAINT fk_asignacion_trabajador
        FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador)
);
GO

/* =========================
   INDICES
   ========================= */

CREATE INDEX ix_producto_categoria
ON producto(id_categoria);
GO

CREATE INDEX ix_equipo_estado
ON equipo(id_estado_equipo);
GO

CREATE INDEX ix_equipo_producto
ON equipo(id_producto);
GO

CREATE INDEX ix_movimiento_equipo_fecha
ON movimiento(id_equipo, fecha_movimiento DESC);
GO

CREATE INDEX ix_movimiento_tipo_fecha
ON movimiento(id_tipo_movimiento, fecha_movimiento DESC);
GO

CREATE INDEX ix_movimiento_destino
ON movimiento(id_trabajador_destino);
GO

CREATE INDEX ix_asignacion_trabajador
ON asignacion_actual(id_trabajador);
GO
