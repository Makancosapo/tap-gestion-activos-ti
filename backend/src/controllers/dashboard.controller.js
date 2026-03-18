const dashboardService = require('../services/dashboard.service')

async function getResumen(req, res, next) {
    try {
        const data = await dashboardService.obtenerResumen()
        res.json({ ok: true, data })
    } catch (error) {
        next(error)
    }
}

async function getEquiposPorEstado(req, res, next) {
    try {
        const data = await dashboardService.obtenerPorEstado()
        res.json({ ok: true, data })
    } catch (error) {
        next(error)
    }
}

async function getEquiposPorCategoria(req, res, next) {
    try {
        const data = await dashboardService.obtenerPorCategoria()
        res.json({ ok: true, data })
    } catch (error) {
        next(error)
    }
}

async function getMovimientosRecientes(req, res, next) {
    try {
        const data = await dashboardService.obtenerMovimientosRecientes()
        res.json({ ok: true, data })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getResumen,
    getEquiposPorEstado,
    getEquiposPorCategoria,
    getMovimientosRecientes
}