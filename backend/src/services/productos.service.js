const { getConnection, sql } = require('../config/db')

async function obtenerProductos() {
    const pool = await getConnection()

    const result = await pool.request().query(`
    SELECT
      p.id_producto,
      p.nombre_producto,
      p.descripcion,
      p.marca,
      p.modelo,
      p.id_categoria,
      cp.nombre_categoria AS categoria
    FROM producto p
    INNER JOIN categoria_producto cp
      ON p.id_categoria = cp.id_categoria
    ORDER BY p.id_producto
  `)

    return result.recordset
}

async function obtenerProductoPorId(idProducto) {
    const pool = await getConnection()

    const result = await pool
        .request()
        .input('idProducto', sql.Int, idProducto)
        .query(`
      SELECT
        p.id_producto,
        p.nombre_producto,
        p.descripcion,
        p.marca,
        p.modelo,
        p.id_categoria,
        cp.nombre_categoria AS categoria
      FROM producto p
      INNER JOIN categoria_producto cp
        ON p.id_categoria = cp.id_categoria
      WHERE p.id_producto = @idProducto
    `)

    return result.recordset[0] || null
}

async function crearProducto(data) {
    const pool = await getConnection()

    await pool
        .request()
        .input('nombre_producto', sql.VarChar(150), data.nombre_producto)
        .input('descripcion', sql.VarChar(255), data.descripcion ?? null)
        .input('marca', sql.VarChar(100), data.marca)
        .input('modelo', sql.VarChar(100), data.modelo)
        .input('id_categoria', sql.Int, data.id_categoria)
        .query(`
      INSERT INTO producto (
        nombre_producto,
        descripcion,
        marca,
        modelo,
        id_categoria
      )
      VALUES (
        @nombre_producto,
        @descripcion,
        @marca,
        @modelo,
        @id_categoria
      )
    `)

    const result = await pool
        .request()
        .input('nombre_producto', sql.VarChar(150), data.nombre_producto)
        .input('modelo', sql.VarChar(100), data.modelo)
        .query(`
      SELECT TOP 1
        p.id_producto,
        p.nombre_producto,
        p.descripcion,
        p.marca,
        p.modelo,
        p.id_categoria
      FROM producto p
      WHERE p.nombre_producto = @nombre_producto
        AND p.modelo = @modelo
      ORDER BY p.id_producto DESC
    `)

    return result.recordset[0]
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto
}