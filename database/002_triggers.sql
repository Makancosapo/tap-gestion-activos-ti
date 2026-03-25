USE gestion_activos_ti;
GO

/* =========================
   TRIGGER VALIDAR MOVIMIENTO
   ========================= */

CREATE OR ALTER TRIGGER trg_validar_movimiento
ON movimiento
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE 
        @id_equipo INT,
        @id_tipo_movimiento INT,
        @estado_actual VARCHAR(50),
        @tipo_movimiento VARCHAR(50),
        @tiene_historial INT;

    SELECT TOP 1
        @id_equipo = i.id_equipo,
        @id_tipo_movimiento = i.id_tipo_movimiento
    FROM inserted i;

    SELECT @tipo_movimiento = descripcion_tipo
    FROM tipo_movimiento
    WHERE id_tipo_movimiento = @id_tipo_movimiento;

    SELECT @estado_actual = ee.descripcion_estado
    FROM equipo e
    INNER JOIN estado_equipo ee
        ON e.id_estado_equipo = ee.id_estado_equipo
    WHERE e.id_equipo = @id_equipo;

    SELECT @tiene_historial = COUNT(*)
    FROM movimiento
    WHERE id_equipo = @id_equipo;

    IF @tipo_movimiento = 'Entrada' AND @tiene_historial > 0
    BEGIN
        RAISERROR('El equipo ya tiene historial; no corresponde una nueva entrada.', 16, 1);
        RETURN;
    END

    IF @tipo_movimiento = 'Asignacion' AND @estado_actual <> 'Disponible'
    BEGIN
        RAISERROR('Solo se pueden asignar equipos disponibles.', 16, 1);
        RETURN;
    END

    IF @tipo_movimiento = 'Asignacion'
       AND EXISTS (
            SELECT 1
            FROM inserted
            WHERE id_trabajador_destino IS NULL
       )
    BEGIN
        RAISERROR('La asignacion requiere trabajador destino.', 16, 1);
        RETURN;
    END

    IF @tipo_movimiento = 'Asignacion'
       AND EXISTS (
            SELECT 1
            FROM inserted i
            INNER JOIN trabajador t
                ON i.id_trabajador_destino = t.id_trabajador
            INNER JOIN estado_trabajador et
                ON t.id_estado_trabajador = et.id_estado_trabajador
            WHERE et.descripcion_estado <> 'Activo'
       )
    BEGIN
        RAISERROR('No se puede asignar un equipo a un trabajador inactivo.', 16, 1);
        RETURN;
    END

    IF @tipo_movimiento = 'Devolucion' AND @estado_actual <> 'Asignado'
    BEGIN
        RAISERROR('Solo se pueden devolver equipos asignados.', 16, 1);
        RETURN;
    END

    IF @tipo_movimiento = 'Mantenimiento'
       AND (@estado_actual = 'En mantenimiento' OR @estado_actual = 'Dado de baja')
    BEGIN
        RAISERROR('El equipo no puede ingresar a mantenimiento en su estado actual.', 16, 1);
        RETURN;
    END

    IF @tipo_movimiento = 'Salida Mantenimiento' AND @estado_actual <> 'En mantenimiento'
    BEGIN
        RAISERROR('El equipo no esta en mantenimiento.', 16, 1);
        RETURN;
    END

    IF @tipo_movimiento = 'Baja' AND @estado_actual = 'Dado de baja'
    BEGIN
        RAISERROR('El equipo ya esta dado de baja.', 16, 1);
        RETURN;
    END

    INSERT INTO movimiento (
        fecha_movimiento,
        id_equipo,
        id_tipo_movimiento,
        id_trabajador_registra,
        id_trabajador_destino,
        motivo
    )
    SELECT
        ISNULL(fecha_movimiento, GETDATE()),
        id_equipo,
        id_tipo_movimiento,
        id_trabajador_registra,
        id_trabajador_destino,
        motivo
    FROM inserted;
END;
GO

/* =========================
   TRIGGER ACTUALIZAR ESTADO
   ========================= */

CREATE OR ALTER TRIGGER trg_actualizar_estado_equipo
ON movimiento
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE e
    SET e.id_estado_equipo =
        CASE tm.descripcion_tipo
            WHEN 'Entrada' THEN (
                SELECT id_estado_equipo
                FROM estado_equipo
                WHERE descripcion_estado = 'Disponible'
            )
            WHEN 'Asignacion' THEN (
                SELECT id_estado_equipo
                FROM estado_equipo
                WHERE descripcion_estado = 'Asignado'
            )
            WHEN 'Devolucion' THEN (
                SELECT id_estado_equipo
                FROM estado_equipo
                WHERE descripcion_estado = 'Disponible'
            )
            WHEN 'Mantenimiento' THEN (
                SELECT id_estado_equipo
                FROM estado_equipo
                WHERE descripcion_estado = 'En mantenimiento'
            )
            WHEN 'Salida Mantenimiento' THEN (
                SELECT id_estado_equipo
                FROM estado_equipo
                WHERE descripcion_estado = 'Disponible'
            )
            WHEN 'Baja' THEN (
                SELECT id_estado_equipo
                FROM estado_equipo
                WHERE descripcion_estado = 'Dado de baja'
            )
            ELSE e.id_estado_equipo
        END
    FROM equipo e
    INNER JOIN inserted i
        ON e.id_equipo = i.id_equipo
    INNER JOIN tipo_movimiento tm
        ON i.id_tipo_movimiento = tm.id_tipo_movimiento;
END;
GO

/* =========================
   TRIGGER ACTUALIZAR ASIGNACION ACTUAL
   ========================= */

CREATE OR ALTER TRIGGER trg_actualizar_asignacion_actual
ON movimiento
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE aa
    SET 
        aa.id_trabajador = i.id_trabajador_destino,
        aa.fecha_asignacion = i.fecha_movimiento
    FROM asignacion_actual aa
    INNER JOIN inserted i
        ON aa.id_equipo = i.id_equipo
    INNER JOIN tipo_movimiento tm
        ON i.id_tipo_movimiento = tm.id_tipo_movimiento
    WHERE tm.descripcion_tipo = 'Asignacion';

    INSERT INTO asignacion_actual (id_equipo, id_trabajador, fecha_asignacion)
    SELECT
        i.id_equipo,
        i.id_trabajador_destino,
        i.fecha_movimiento
    FROM inserted i
    INNER JOIN tipo_movimiento tm
        ON i.id_tipo_movimiento = tm.id_tipo_movimiento
    LEFT JOIN asignacion_actual aa
        ON aa.id_equipo = i.id_equipo
    WHERE tm.descripcion_tipo = 'Asignacion'
      AND aa.id_equipo IS NULL
      AND i.id_trabajador_destino IS NOT NULL;

    DELETE aa
    FROM asignacion_actual aa
    INNER JOIN inserted i
        ON aa.id_equipo = i.id_equipo
    INNER JOIN tipo_movimiento tm
        ON i.id_tipo_movimiento = tm.id_tipo_movimiento
    WHERE tm.descripcion_tipo IN ('Devolucion', 'Baja');
END;
GO

/* =========================
   TRIGGER BLOQUEAR DELETE
   ========================= */

CREATE OR ALTER TRIGGER trg_bloquear_delete_movimiento
ON movimiento
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR('No se permite eliminar movimientos del historial.', 16, 1);
END;
GO
