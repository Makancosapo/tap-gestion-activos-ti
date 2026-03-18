const { getConnection, sql } = require('../config/db')

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
      ee.descripcion_estado AS estado
    FROM equipo e
    INNER JOIN producto p
      ON e.id_producto = p.id_producto
    INNER JOIN categoria_producto cp
      ON p.id_categoria = cp.id_categoria
    INNER JOIN estado_equipo ee
      ON e.id_estado_equipo = ee.id_estado_equipo
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
        ee.descripcion_estado AS estado
      FROM equipo e
      INNER JOIN producto p
        ON e.id_producto = p.id_producto
      INNER JOIN categoria_producto cp
        ON p.id_categoria = cp.id_categoria
      INNER JOIN estado_equipo ee
        ON e.id_estado_equipo = ee.id_estado_equipo
      WHERE e.id_equipo = @idEquipo
    `)

    return result.recordset[0] || null
}

async function crearEquipo(data) {
    const pool = await getConnection()

    await pool
        .request()
        .input('id_producto', sql.Int, data.id_producto)
        .input('numero_serie', sql.VarChar(100), data.numero_serie)
        .input('codigo_interno', sql.VarChar(100), data.codigo_interno)
        .input('fecha_ingreso', sql.Date, data.fecha_ingreso)
        .input('id_estado_equipo', sql.Int, data.id_estado_equipo)
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
        .input('codigo_interno', sql.VarChar(100), data.codigo_interno)
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