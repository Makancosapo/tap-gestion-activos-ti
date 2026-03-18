const express = require('express')
const router = express.Router()
const reportesController = require('../controllers/reportes.controller')

router.get('/movimientos', reportesController.obtenerReporteMovimientos)
router.get('/inventario-actual', reportesController.obtenerInventarioActual)
router.get('/resumen-tipo', reportesController.obtenerResumenPorTipo)

module.exports = router