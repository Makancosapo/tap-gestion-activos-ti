const movimientosService = require('../services/movimientos.service')

async function obtenerTiposMovimiento(req, res, next) {
    try {
        const data = await movimientosService.obtenerTiposMovimiento()

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function registrarMovimiento(req, res, next) {
    try {
        const {
            fecha_movimiento,
            id_equipo,
            id_tipo_movimiento,
            id_trabajador_registra,
            id_trabajador_destino,
            motivo
        } = req.body

        if (!id_equipo || !id_tipo_movimiento || !id_trabajador_registra) {
            return res.status(400).json({
                ok: false,
                message: 'id_equipo, id_tipo_movimiento e id_trabajador_registra son obligatorios'
            })
        }

        const data = await movimientosService.crearMovimiento({
            fecha_movimiento,
            id_equipo,
            id_tipo_movimiento,
            id_trabajador_registra,
            id_trabajador_destino,
            motivo
        })

        res.status(201).json({
            ok: true,
            message: 'Movimiento registrado correctamente',
            data
        })
    } catch (error) {
        next(error)
    }
}

async function obtenerHistorialPorEquipo(req, res, next) {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                ok: false,
                message: 'El id del equipo es obligatorio'
            })
        }

        const data = await movimientosService.obtenerHistorialPorEquipo(Number(id))

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    obtenerTiposMovimiento,
    registrarMovimiento,
    obtenerHistorialPorEquipo
}