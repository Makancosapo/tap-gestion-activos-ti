const { getConnection, sql } = require('../config/db')

function generarSiguienteCodigo(ultimoCodigo) {
  if (!ultimoCodigo) {
    return 'TI-0001'
  }

  const partes = ultimoCodigo.split('-')
  const numeroActual = parseInt(partes[1], 10)
  const siguienteNumero = numeroActual + 1

  return `TI-${String(siguienteNumero).padStart(4, '0')}`
}

async function obtenerEquipos() {
  const pool = await getConnection()

  const result = await pool.request().query(`
    SELECT
      e.id_equipo,
      e.codigo_interno,
      e.numero_serie,
      e.fecha_ingreso,
      e.observacion,
      p.id_producto,
      p.nombre_producto,
      p.marca,
      p.modelo,
      cp.nombre_categoria AS categoria,
      ee.id_estado_equipo,
      ee.descripcion_estado AS estado,
      CONCAT(t.nombre, ' ', t.apellido) AS empleado_asignado
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

async function obtenerEquipoPorId(idEquipo) {
  const pool = await getConnection()

  const result = await pool
    .request()
    .input('idEquipo', sql.Int, idEquipo)
    .query(`
      SELECT
        e.id_equipo,
        e.codigo_interno,
        e.numero_serie,
        e.fecha_ingreso,
        e.observacion,
        p.id_producto,
        p.nombre_producto,
        p.descripcion,
        p.marca,
        p.modelo,
        cp.nombre_categoria AS categoria,
        ee.id_estado_equipo,
        ee.descripcion_estado AS estado,
        CONCAT(t.nombre, ' ', t.apellido) AS empleado_asignado
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
      WHERE e.id_equipo = @idEquipo
    `)

  return result.recordset[0] || null
}

async function crearEquipo(data) {
  const pool = await getConnection()

  const ultimoCodigoResult = await pool.request().query(`
      SELECT TOP 1 codigo_interno
      FROM equipo
      ORDER BY id_equipo DESC
    `)

  const ultimoCodigo = ultimoCodigoResult.recordset[0]?.codigo_interno || null
  const nuevoCodigo = generarSiguienteCodigo(ultimoCodigo)

  await pool
    .request()
    .input('id_producto', sql.Int, data.id_producto)
    .input('numero_serie', sql.VarChar(100), data.numero_serie)
    .input('codigo_interno', sql.VarChar(100), nuevoCodigo)
    .input('fecha_ingreso', sql.Date, data.fecha_ingreso)
    .input('id_estado_equipo', sql.Int, 1)
    .input('observacion', sql.VarChar(255), data.observacion ?? null)
    .query(`
      INSERT INTO equipo (
        id_producto,
        numero_serie,
        codigo_interno,
        fecha_ingreso,
        id_estado_equipo,
        observacion
      )
      VALUES (
        @id_producto,
        @numero_serie,
        @codigo_interno,
        @fecha_ingreso,
        @id_estado_equipo,
        @observacion
      )
    `)

  const result = await pool
    .request()
    .input('codigo_interno', sql.VarChar(100), nuevoCodigo)
    .query(`
      SELECT TOP 1
        e.id_equipo,
        e.id_producto,
        e.numero_serie,
        e.codigo_interno,
        e.fecha_ingreso,
        e.id_estado_equipo,
        e.observacion
      FROM equipo e
      WHERE e.codigo_interno = @codigo_interno
      ORDER BY e.id_equipo DESC
    `)

  return result.recordset[0]
}

module.exports = {
  obtenerEquipos,
  obtenerEquipoPorId,
  crearEquipo
}