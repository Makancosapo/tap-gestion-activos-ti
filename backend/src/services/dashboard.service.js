const { getConnection } = require('../config/db')

async function obtenerResumen() {
    const pool = await getConnection()

    const result = await pool.request().query(`
    SELECT
      COUNT(*) AS total_equipos,
      SUM(CASE WHEN ee.descripcion_estado = 'Asignado' THEN 1 ELSE 0 END) AS asignados,
      SUM(CASE WHEN ee.descripcion_estado = 'Disponible' THEN 1 ELSE 0 END) AS disponibles,
      SUM(CASE WHEN ee.descripcion_estado = 'En mantenimiento' THEN 1 ELSE 0 END) AS mantenimiento,
      SUM(CASE WHEN ee.descripcion_estado = 'Dado de baja' THEN 1 ELSE 0 END) AS baja
    FROM equipo e
    INNER JOIN estado_equipo ee
      ON e.id_estado_equipo = ee.id_estado_equipo
  `)

    return result.recordset[0]
}

async function obtenerPorEstado() {
    const pool = await getConnection()

    const result = await pool.request().query(`
    SELECT
      ee.descripcion_estado AS estado,
      COUNT(*) AS cantidad
    FROM equipo e
    INNER JOIN estado_equipo ee
      ON e.id_estado_equipo = ee.id_estado_equipo
    GROUP BY ee.descripcion_estado
    ORDER BY ee.descripcion_estado
  `)

    return result.recordset
}

async function obtenerPorCategoria() {
    const pool = await getConnection()

    const result = await pool.request().query(`
    SELECT
      cp.nombre_categoria AS categoria,
      COUNT(*) AS cantidad
    FROM equipo e
    INNER JOIN producto p
      ON e.id_producto = p.id_producto
    INNER JOIN categoria_producto cp
      ON p.id_categoria = cp.id_categoria
    GROUP BY cp.nombre_categoria
    ORDER BY cp.nombre_categoria
  `)

    return result.recordset
}

async function obtenerMovimientosRecientes() {
    const pool = await getConnection()

    const result = await pool.request().query(`
    SELECT TOP 10
      m.id_movimiento,
      m.fecha_movimiento,
      e.codigo_interno,
      p.nombre_producto,
      cp.nombre_categoria AS categoria,
      tm.descripcion_tipo AS tipo_movimiento,
      CONCAT(tr.nombre, ' ', tr.apellido) AS registrado_por,
      CONCAT(td.nombre, ' ', td.apellido) AS trabajador_destino,
      m.motivo
    FROM movimiento m
    INNER JOIN equipo e
      ON m.id_equipo = e.id_equipo
    INNER JOIN producto p
      ON e.id_producto = p.id_producto
    INNER JOIN categoria_producto cp
      ON p.id_categoria = cp.id_categoria
    INNER JOIN tipo_movimiento tm
      ON m.id_tipo_movimiento = tm.id_tipo_movimiento
    INNER JOIN trabajador tr
      ON m.id_trabajador_registra = tr.id_trabajador
    LEFT JOIN trabajador td
      ON m.id_trabajador_destino = td.id_trabajador
    ORDER BY m.fecha_movimiento DESC, m.id_movimiento DESC
  `)

    return result.recordset
}

module.exports = {
    obtenerResumen,
    obtenerPorEstado,
    obtenerPorCategoria,
    obtenerMovimientosRecientes
}