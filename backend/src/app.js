const express = require('express')
const cors = require('cors')
const inventarioRoutes = require('./routes/inventario.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const movimientosRoutes = require('./routes/movimientos.routes')
const errorHandler = require('./middlewares/errorHandler')
const productosRoutes = require('./routes/productos.routes')
const equiposRoutes = require('./routes/equipos.routes')
const reportesRoutes = require('./routes/reportes.routes')
const trabajadoresRoutes = require('./routes/trabajadores.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'API funcionando'
    })
})

app.use('/api/inventario', inventarioRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/movimientos', movimientosRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/equipos', equiposRoutes)
app.use('/api/reportes', reportesRoutes)
app.use(errorHandler)
app.use('/api/trabajadores', trabajadoresRoutes)

module.exports = app