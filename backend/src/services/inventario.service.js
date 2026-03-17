const { getConnection, sql } = require('../config/db')

async function obtenerInventario() {
    const pool = await getConnection()

    const result = await pool.request().query(`
    SELECT
        e.id_equipo,
        e.codigo_interno,
        e.numero_serie,
        p.nombre_producto,
        p.marca,
        p.modelo,
        cp.nombre_categoria AS categoria,
        ee.descripcion_estado AS estado,
        CONCAT(t.nombre, ' ', t.apellido) AS empleado_asignado,
        e.fecha_ingreso,
        e.observacion
    FROM equipo e
    INNER JOIN producto p
        ON e.id_producto = p.id_producto
    INNER JOIN categoria_producto cp
        ON p.id_categoria = cp.id_categoria
    INNER JOIN estado_equipo ee
        ON e.id_estado_equipo = ee.id_estado_equipo
    LEFT JOIN asignacion_actual aa
        ON e.id_equipo = aa.id_equipo
    LEFT JOIN trabajador t
        ON aa.id_trabajador = t.id_trabajador
    ORDER BY e.id_equipo
  `)

    return result.recordset
}

async function buscarInventario(busqueda) {
    const pool = await getConnection()

    const result = await pool
        .request()
        .input('busqueda', sql.VarChar(100), busqueda)
        .query(`
      SELECT
          e.id_equipo,
          e.codigo_interno,
          e.numero_serie,
          p.nombre_producto,
          p.marca,
          p.modelo,
          cp.nombre_categoria AS categoria,
          ee.descripcion_estado AS estado,
          CONCAT(t.nombre, ' ', t.apellido) AS empleado_asignado,
          e.fecha_ingreso,
          e.observacion
      FROM equipo e
      INNER JOIN producto p
          ON e.id_producto = p.id_producto
      INNER JOIN categoria_producto cp
          ON p.id_categoria = cp.id_categoria
      INNER JOIN estado_equipo ee
          ON e.id_estado_equipo = ee.id_estado_equipo
      LEFT JOIN asignacion_actual aa
          ON e.id_equipo = aa.id_equipo
      LEFT JOIN trabajador t
          ON aa.id_trabajador = t.id_trabajador
      WHERE e.codigo_interno = @busqueda
         OR e.numero_serie = @busqueda
      ORDER BY e.id_equipo
    `)

    return result.recordset
}

module.exports = {
    obtenerInventario,
    buscarInventario
}