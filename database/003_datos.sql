USE gestion_activos_ti;
GO

/* =========================
   DATOS BASE
   ========================= */

INSERT INTO cargo (descripcion_cargo) VALUES
('Administrador TI'),
('Soporte TI'),
('Analista'),
('Jefe de Área');
GO

INSERT INTO estado_trabajador (descripcion_estado) VALUES
('Activo'),
('Inactivo');
GO

INSERT INTO categoria_producto (nombre_categoria) VALUES
('Notebook'),
('Monitor'),
('Periferico');
GO

INSERT INTO estado_equipo (descripcion_estado) VALUES
('Disponible'),
('Asignado'),
('En mantenimiento'),
('Dado de baja');
GO

INSERT INTO tipo_movimiento (descripcion_tipo) VALUES
('Entrada'),
('Asignacion'),
('Devolucion'),
('Mantenimiento'),
('Salida Mantenimiento'),
('Baja');
GO

/* =========================
   TRABAJADORES
   ========================= */

INSERT INTO trabajador (nombre, apellido, id_cargo, id_estado_trabajador) VALUES
('Carlos','Mendoza',1,1),
('Ana','Rojas',2,1),
('Luis','Herrera',3,1),
('María','González',3,1),
('Pedro','Soto',4,1),
('Daniel','Paredes',3,1),
('Fernanda','Silva',3,1);
GO

/* =========================
   PRODUCTOS
   ========================= */

INSERT INTO producto (nombre_producto, descripcion, marca, modelo, id_categoria) VALUES
('Notebook Empresarial','Notebook corporativo','Dell','Latitude 5440',1),
('Monitor Oficina','Monitor 24 pulgadas','Samsung','S24F350',2),
('Mouse Inalambrico','Mouse óptico inalámbrico','Logitech','M280',3),
('Teclado USB','Teclado estándar','Logitech','K120',3),
('Notebook Desarrollo','Notebook alto rendimiento','HP','EliteBook 840',1);
GO

/* =========================
   EQUIPOS
   ========================= */

INSERT INTO equipo (id_producto, numero_serie, codigo_interno, fecha_ingreso, id_estado_equipo, observacion) VALUES
(1,'SN-DL-001','TI-0001','2026-03-01',1,'Ingreso marzo'),
(1,'SN-DL-002','TI-0002','2026-03-01',1,'Ingreso marzo'),
(2,'SN-MON-001','TI-0003','2026-03-02',1,'Ingreso monitor'),
(2,'SN-MON-002','TI-0004','2026-03-02',1,'Ingreso monitor'),
(3,'SN-MOU-001','TI-0005','2026-03-03',1,'Ingreso mouse'),
(4,'SN-TEC-001','TI-0006','2026-03-03',1,'Ingreso teclado'),
(5,'SN-HP-001','TI-0007','2026-03-05',1,'Notebook desarrollo'),
(5,'SN-HP-002','TI-0008','2026-03-05',1,'Notebook desarrollo');
GO

/* =========================
   MOVIMIENTOS INICIALES
   ========================= */

INSERT INTO movimiento (fecha_movimiento, id_equipo, id_tipo_movimiento, id_trabajador_registra, motivo)
VALUES
('2026-03-01',1,1,1,'Ingreso inventario'),
('2026-03-01',2,1,1,'Ingreso inventario'),
('2026-03-02',3,1,1,'Ingreso inventario'),
('2026-03-02',4,1,1,'Ingreso inventario'),
('2026-03-03',5,1,1,'Ingreso inventario'),
('2026-03-03',6,1,1,'Ingreso inventario'),
('2026-03-05',7,1,1,'Ingreso inventario'),
('2026-03-05',8,1,1,'Ingreso inventario');
GO

/* =========================
   PRUEBAS DE FLUJO
   ========================= */

-- Equipo 2 queda asignado al final
INSERT INTO movimiento (fecha_movimiento, id_equipo, id_tipo_movimiento, id_trabajador_registra, id_trabajador_destino, motivo)
VALUES
('2026-03-06',2,2,1,7,'Asignacion de prueba a Fernanda Silva');
GO

-- Equipo 7 queda asignado a Ana
INSERT INTO movimiento (fecha_movimiento, id_equipo, id_tipo_movimiento, id_trabajador_registra, id_trabajador_destino, motivo)
VALUES
('2026-03-06',7,2,1,2,'Notebook desarrollo');
GO

-- Equipo 5 pasa por mantenimiento y vuelve a disponible
INSERT INTO movimiento (fecha_movimiento, id_equipo, id_tipo_movimiento, id_trabajador_registra, motivo)
VALUES
('2026-03-10',5,4,1,'Revision tecnica');
GO

INSERT INTO movimiento (fecha_movimiento, id_equipo, id_tipo_movimiento, id_trabajador_registra, motivo)
VALUES
('2026-03-11',5,5,1,'Salida de mantenimiento');
GO
