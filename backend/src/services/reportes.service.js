const { getConnection, sql } = require('../config/db')

async function obtenerReporteMovimientos(filtros) {
    const pool = await getConnection()

    const request = pool.request()
        .input('id_trabajador', sql.Int, filtros.id_trabajador)
        .input('tipo', sql.VarChar(50), filtros.tipo)
        .input('fecha_inicio', sql.Date, filtros.fecha_inicio)
        .input('fecha_fin', sql.Date, filtros.fecha_fin)

    const result = await request.query(`
    SELECT
      m.id_movimiento,
      m.fecha_movimiento,
      tm.descripcion_tipo AS tipo_movimiento,
      e.id_equipo,
      e.codigo_interno,
      e.numero_serie,
      p.nombre_producto,
      cp.nombre_categoria AS categoria,
      CONCAT(trr.nombre, ' ', trr.apellido) AS registrado_por,
      CONCAT(trd.nombre, ' ', trd.apellido) AS trabajador_destino,
      m.motivo
    FROM movimiento m
    INNER JOIN tipo_movimiento tm
      ON m.id_tipo_movimiento = tm.id_tipo_movimiento
    INNER JOIN equipo e
      ON m.id_equipo = e.id_equipo
    INNER JOIN producto p
      ON e.id_producto = p.id_producto
    INNER JOIN categoria_producto cp
      ON p.id_categoria = cp.id_categoria
    INNER JOIN trabajador trr
      ON m.id_trabajador_registra = trr.id_trabajador
    LEFT JOIN trabajador trd
      ON m.id_trabajador_destino = trd.id_trabajador
    WHERE (@id_trabajador IS NULL OR m.id_trabajador_destino = @id_trabajador)
      AND (@tipo IS NULL OR tm.descripcion_tipo = @tipo)
      AND (@fecha_inicio IS NULL OR CAST(m.fecha_movimiento AS DATE) >= @fecha_inicio)
      AND (@fecha_fin IS NULL OR CAST(m.fecha_movimiento AS DATE) <= @fecha_fin)
    ORDER BY m.fecha_movimiento DESC, m.id_movimiento DESC
  `)

    return result.recordset
}

async function obtenerInventarioActual() {
    const pool = await getConnection()

    const result = await pool.request().query(`
    SELECT
      CONCAT(t.nombre, ' ', t.apellido) AS trabajador,
      e.id_equipo,
      e.codigo_interno,
      e.numero_serie,
      p.nombre_producto,
      cp.nombre_categoria AS categoria,
      aa.fecha_asignacion
    FROM asignacion_actual aa
    INNER JOIN trabajador t
      ON aa.id_trabajador = t.id_trabajador
    INNER JOIN equipo e
      ON aa.id_equipo = e.id_equipo
    INNER JOIN producto p
      ON e.id_producto = p.id_producto
    INNER JOIN categoria_producto cp
      ON p.id_categoria = cp.id_categoria
    ORDER BY trabajador, e.codigo_interno
  `)

    return result.recordset
}

async function obtenerResumenPorTipo() {
    const pool = await getConnection()

    const result = await pool.request().query(`
    SELECT
      tm.descripcion_tipo AS tipo_movimiento,
      COUNT(*) AS total_registros
    FROM movimiento m
    INNER JOIN tipo_movimiento tm
      ON m.id_tipo_movimiento = tm.id_tipo_movimiento
    GROUP BY tm.descripcion_tipo
    ORDER BY total_registros DESC, tm.descripcion_tipo
  `)

    return result.recordset
}

module.exports = {
    obtenerReporteMovimientos,
    obtenerInventarioActual,
    obtenerResumenPorTipo
}