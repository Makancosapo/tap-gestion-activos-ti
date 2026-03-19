const { getConnection } = require('../config/db')

async function obtenerTrabajadores() {
    const pool = await getConnection()

    const result = await pool.request().query(`
    SELECT
      t.id_trabajador,
      t.nombre,
      t.apellido,
      c.descripcion_cargo AS cargo,
      et.descripcion_estado AS estado
    FROM trabajador t
    INNER JOIN cargo c
      ON t.id_cargo = c.id_cargo
    INNER JOIN estado_trabajador et
      ON t.id_estado_trabajador = et.id_estado_trabajador
    WHERE et.descripcion_estado = 'Activo'
    ORDER BY t.nombre, t.apellido
  `)

    return result.recordset
}

module.exports = {
    obtenerTrabajadores
}