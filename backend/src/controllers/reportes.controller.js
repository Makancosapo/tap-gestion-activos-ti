const reportesService = require('../services/reportes.service')

async function obtenerReporteMovimientos(req, res, next) {
    try {
        const { id_trabajador, tipo, fecha_inicio, fecha_fin } = req.query

        const data = await reportesService.obtenerReporteMovimientos({
            id_trabajador: id_trabajador ? Number(id_trabajador) : null,
            tipo: tipo || null,
            fecha_inicio: fecha_inicio || null,
            fecha_fin: fecha_fin || null
        })

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function obtenerInventarioActual(req, res, next) {
    try {
        const data = await reportesService.obtenerInventarioActual()

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function obtenerResumenPorTipo(req, res, next) {
    try {
        const data = await reportesService.obtenerResumenPorTipo()

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    obtenerReporteMovimientos,
    obtenerInventarioActual,
    obtenerResumenPorTipo
}