const express = require('express')
const router = express.Router()
const inventarioController = require('../controllers/inventario.controller')

router.get('/', inventarioController.listarInventario)
router.get('/buscar', inventarioController.buscarInventario)

module.exports = router