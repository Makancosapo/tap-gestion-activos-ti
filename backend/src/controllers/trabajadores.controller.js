const trabajadoresService = require('../services/trabajadores.service')

async function listarTrabajadores(req, res, next) {
    try {
        const data = await trabajadoresService.obtenerTrabajadores()

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    listarTrabajadores
}