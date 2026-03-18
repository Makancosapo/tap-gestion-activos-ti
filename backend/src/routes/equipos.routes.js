const express = require('express')
const router = express.Router()
const equiposController = require('../controllers/equipos.controller')

router.get('/', equiposController.listarEquipos)
router.get('/:id', equiposController.obtenerEquipoPorId)
router.post('/', equiposController.crearEquipo)

module.exports = router