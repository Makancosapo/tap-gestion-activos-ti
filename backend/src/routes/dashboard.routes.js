const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard.controller')

router.get('/resumen', dashboardController.getResumen)
router.get('/estados', dashboardController.getEquiposPorEstado)
router.get('/categorias', dashboardController.getEquiposPorCategoria)
router.get('/movimientos-recientes', dashboardController.getMovimientosRecientes)

module.exports = router