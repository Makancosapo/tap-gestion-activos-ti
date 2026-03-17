const { getConnection, sql } = require('./config/db')

async function testConnection() {
    try {
        const pool = await getConnection()

        const result = await pool.request().query('SELECT DB_NAME() AS database_name')

        console.log('✅ Conexión exitosa a SQL Server')
        console.log('Base conectada:', result.recordset[0].database_name)

        await sql.close()
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:')
        console.error(error.message)
    }
}

testConnection()