const inventarioService = require('../services/inventario.service')

async function listarInventario(req, res, next) {
    try {
        const data = await inventarioService.obtenerInventario()

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function buscarInventario(req, res, next) {
    try {
        const { q } = req.query
        const data = await inventarioService.buscarInventario(q || '')

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    listarInventario,
    buscarInventario
}