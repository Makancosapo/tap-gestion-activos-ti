const express = require('express')
const router = express.Router()
const movimientosController = require('../controllers/movimientos.controller')

router.post('/', movimientosController.registrarMovimiento)
router.get('/equipo/:id/historial', movimientosController.obtenerHistorialPorEquipo)

module.exports = router