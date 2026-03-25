const { getConnection, sql } = require('../config/db')

async function obtenerMovimientosFiltrados(filtros) {
  const pool = await getConnection()

  const request = pool.request()

  const idTrabajador = filtros.id_trabajador ? Number(filtros.id_trabajador) : null
  const idTipoMovimiento = filtros.id_tipo_movimiento ? Number(filtros.id_tipo_movimiento) : null
  const fechaDesde = filtros.fecha_desde || null
  const fechaHasta = filtros.fecha_hasta || null

  request.input('id_trabajador', sql.Int, idTrabajador)
  request.input('id_tipo_movimiento', sql.Int, idTipoMovimiento)
  request.input('fecha_desde', sql.Date, fechaDesde)
  request.input('fecha_hasta', sql.Date, fechaHasta)

  const result = await request.query(`
        SELECT
            m.id_movimiento,
            m.fecha_movimiento,
            e.codigo_interno,
            p.nombre_producto,
            p.marca,
            p.modelo,
            tm.descripcion_tipo AS tipo_movimiento,
            CONCAT(tr.nombre, ' ', tr.apellido) AS registrado_por,
            CONCAT(td.nombre, ' ', td.apellido) AS trabajador_relacionado,
            m.motivo
        FROM movimiento m
        INNER JOIN equipo e
            ON m.id_equipo = e.id_equipo
        INNER JOIN producto p
            ON e.id_producto = p.id_producto
        INNER JOIN tipo_movimiento tm
            ON m.id_tipo_movimiento = tm.id_tipo_movimiento
        INNER JOIN trabajador tr
            ON m.id_trabajador_registra = tr.id_trabajador
        LEFT JOIN trabajador td
            ON m.id_trabajador_destino = td.id_trabajador
        WHERE
            (@id_trabajador IS NULL
                OR m.id_trabajador_registra = @id_trabajador
                OR m.id_trabajador_destino = @id_trabajador)
            AND (@id_tipo_movimiento IS NULL
                OR m.id_tipo_movimiento = @id_tipo_movimiento)
            AND (@fecha_desde IS NULL
                OR CAST(m.fecha_movimiento AS DATE) >= @fecha_desde)
            AND (@fecha_hasta IS NULL
                OR CAST(m.fecha_movimiento AS DATE) <= @fecha_hasta)
        ORDER BY m.fecha_movimiento DESC, m.id_movimiento DESC
    `)

  return result.recordset
}

module.exports = {
  obtenerMovimientosFiltrados
}