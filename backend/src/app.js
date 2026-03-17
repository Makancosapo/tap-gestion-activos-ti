const express = require('express')
const cors = require('cors')
const inventarioRoutes = require('./routes/inventario.routes')

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

module.exports = app