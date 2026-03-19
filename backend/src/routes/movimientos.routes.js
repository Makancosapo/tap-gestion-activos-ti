const express = require('express')
const router = express.Router()
const movimientosController = require('../controllers/movimientos.controller')

router.get('/tipos', movimientosController.obtenerTiposMovimiento)
router.post('/', movimientosController.registrarMovimiento)
router.get('/equipo/:id/historial', movimientosController.obtenerHistorialPorEquipo)

module.exports = router