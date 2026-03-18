const { getConnection, sql } = require('../config/db')

async function crearMovimiento(data) {
  const pool = await getConnection()

  const result = await pool
    .request()
    .input(
      'fecha_movimiento',
      sql.DateTime,
      data.fecha_movimiento ? new Date(data.fecha_movimiento) : null
    )
    .input('id_equipo', sql.Int, data.id_equipo)
    .input('id_tipo_movimiento', sql.Int, data.id_tipo_movimiento)
    .input('id_trabajador_registra', sql.Int, data.id_trabajador_registra)
    .input('id_trabajador_destino', sql.Int, data.id_trabajador_destino ?? null)
    .input('motivo', sql.VarChar(255), data.motivo ?? null)
    .query(`
      INSERT INTO movimiento (
        fecha_movimiento,
        id_equipo,
        id_tipo_movimiento,
        id_trabajador_registra,
        id_trabajador_destino,
        motivo
      )
      VALUES (
        ISNULL(@fecha_movimiento, GETDATE()),
        @id_equipo,
        @id_tipo_movimiento,
        @id_trabajador_registra,
        @id_trabajador_destino,
        @motivo
      );

      SELECT TOP 1
        id_movimiento,
        fecha_movimiento,
        id_equipo,
        id_tipo_movimiento,
        id_trabajador_registra,
        id_trabajador_destino,
        motivo
      FROM movimiento
      WHERE id_equipo = @id_equipo
      ORDER BY id_movimiento DESC;
    `)

  return result.recordset[0]
}

async function obtenerHistorialPorEquipo(idEquipo) {
  const pool = await getConnection()

  const result = await pool
    .request()
    .input('idEquipo', sql.Int, idEquipo)
    .query(`
      SELECT
        m.id_movimiento,
        m.fecha_movimiento,
        e.id_equipo,
        e.codigo_interno,
        e.numero_serie,
        p.nombre_producto,
        cp.nombre_categoria AS categoria,
        tm.descripcion_tipo AS tipo_movimiento,
        CONCAT(trr.nombre, ' ', trr.apellido) AS registrado_por,
        CONCAT(trd.nombre, ' ', trd.apellido) AS trabajador_destino,
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
      INNER JOIN trabajador trr
        ON m.id_trabajador_registra = trr.id_trabajador
      LEFT JOIN trabajador trd
        ON m.id_trabajador_destino = trd.id_trabajador
      WHERE m.id_equipo = @idEquipo
      ORDER BY m.fecha_movimiento DESC, m.id_movimiento DESC
    `)

  return result.recordset
}

module.exports = {
  crearMovimiento,
  obtenerHistorialPorEquipo
}