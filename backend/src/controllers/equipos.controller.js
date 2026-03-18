const equiposService = require('../services/equipos.service')

async function listarEquipos(req, res, next) {
    try {
        const data = await equiposService.obtenerEquipos()

        res.json({
            ok: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function obtenerEquipoPorId(req, res, next) {
    try {
        const { id } = req.params
        const data = await equiposService.obtenerEquipoPorId(Number(id))

        if (!data) {
            return res.status(404).json({
                ok: false,
                message: 'Equipo no encontrado'
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

async function crearEquipo(req, res, next) {
    try {
        const {
            id_producto,
            numero_serie,
            codigo_interno,
            fecha_ingreso,
            id_estado_equipo,
            observacion
        } = req.body

        if (!id_producto || !numero_serie || !codigo_interno || !fecha_ingreso || !id_estado_equipo) {
            return res.status(400).json({
                ok: false,
                message: 'id_producto, numero_serie, codigo_interno, fecha_ingreso e id_estado_equipo son obligatorios'
            })
        }

        const data = await equiposService.crearEquipo({
            id_producto,
            numero_serie,
            codigo_interno,
            fecha_ingreso,
            id_estado_equipo,
            observacion
        })

        res.status(201).json({
            ok: true,
            message: 'Equipo creado correctamente',
            data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    listarEquipos,
    obtenerEquipoPorId,
    crearEquipo
}