const express = require('express')
const router = express.Router()
const trabajadoresController = require('../controllers/trabajadores.controller')

router.get('/', trabajadoresController.listarTrabajadores)

module.exports = router