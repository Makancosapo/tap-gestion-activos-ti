const productosService = require('../services/productos.service')

async function listarProductos(req, res, next) {
    try {
        const data = await productosService.obtenerProductos()

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function obtenerProductoPorId(req, res, next) {
    try {
        const { id } = req.params
        const data = await productosService.obtenerProductoPorId(Number(id))

        if (!data) {
            return res.status(404).json({
                ok: false,
                message: 'Producto no encontrado'
            })
        }

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function crearProducto(req, res, next) {
    try {
        const {
            nombre_producto,
            descripcion,
            marca,
            modelo,
            id_categoria
        } = req.body

        if (!nombre_producto || !marca || !modelo || !id_categoria) {
            return res.status(400).json({
                ok: false,
                message: 'nombre_producto, marca, modelo e id_categoria son obligatorios'
            })
        }

        const data = await productosService.crearProducto({
            nombre_producto,
            descripcion,
            marca,
            modelo,
            id_categoria
        })

        res.status(201).json({
            ok: true,
            message: 'Producto creado correctamente',
            data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    listarProductos,
    obtenerProductoPorId,
    crearProducto
}