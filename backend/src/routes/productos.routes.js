const express = require('express')
const router = express.Router()
const productosController = require('../controllers/productos.controller')

router.get('/', productosController.listarProductos)
router.get('/:id', productosController.obtenerProductoPorId)
router.post('/', productosController.crearProducto)

module.exports = router