const reportesService = require('../services/reportes.service')

async function movimientosFiltrados(req, res, next) {
    try {
        const {
            id_trabajador,
            id_tipo_movimiento,
            fecha_desde,
            fecha_hasta
        } = req.query

        const data = await reportesService.obtenerMovimientosFiltrados({
            id_trabajador,
            id_tipo_movimiento,
            fecha_desde,
            fecha_hasta
        })

        res.json({ ok: true, data })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    movimientosFiltrados
}