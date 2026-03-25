const express = require('express')
const router = express.Router()
const reportesController = require('../controllers/reportes.controller')

router.get('/movimientos', reportesController.movimientosFiltrados)

module.exports = router