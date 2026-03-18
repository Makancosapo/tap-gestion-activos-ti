import { useEffect, useState } from "react";
import { getResumenDashboard, getMovimientosRecientes } from "../services/dashboard.service";

function Dashboard() {
    const [resumen, setResumen] = useState(null);
    const [movimientos, setMovimientos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarDatos() {
            try {
                const resumenData = await getResumenDashboard();
                const movimientosData = await getMovimientosRecientes();

                setResumen(resumenData.data);
                setMovimientos(movimientosData.data);
            } catch (err) {
                setError("No se pudieron cargar los datos del dashboard");
                console.error(err);
            }
        }

        cargarDatos();
    }, []);

    return (
        <section>
            <h2>Dashboard</h2>
            <p>Resumen general del sistema.</p>

            {error && <p>{error}</p>}

            {resumen && (
                <div>
                    <p>Total equipos: {resumen.total_equipos}</p>
                    <p>Asignados: {resumen.asignados}</p>
                    <p>Disponibles: {resumen.disponibles}</p>
                    <p>Mantenimiento: {resumen.mantenimiento}</p>
                    <p>Baja: {resumen.baja}</p>
                </div>
            )}

            <h3>Movimientos recientes</h3>

            <ul>
                {movimientos.map((mov) => (
                    <li key={mov.id_movimiento}>
                        {new Date(mov.fecha_movimiento).toLocaleString("es-CL")} - {mov.codigo_interno} - {mov.tipo_movimiento}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Dashboard;