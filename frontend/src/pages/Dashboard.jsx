import { useEffect, useState } from "react";
import {
    getResumenDashboard,
    getMovimientosRecientes,
} from "../services/dashboard.service";
import "../styles/dashboard.css";

function Dashboard() {
    const [resumen, setResumen] = useState(null);
    const [movimientos, setMovimientos] = useState([]);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        cargarDashboard();
    }, []);

    async function cargarDashboard() {
        try {
            setCargando(true);
            setError("");

            const [resumenRes, movimientosRes] = await Promise.all([
                getResumenDashboard(),
                getMovimientosRecientes(),
            ]);

            setResumen(resumenRes.data || null);
            setMovimientos(movimientosRes.data || []);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los datos del dashboard");
        } finally {
            setCargando(false);
        }
    }

    function formatearFecha(fecha) {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleString("es-CL");
    }

    function getTipoClase(tipo) {
        switch (tipo) {
            case "Asignacion":
                return "tipo asignacion";
            case "Devolucion":
                return "tipo devolucion";
            case "Mantenimiento":
                return "tipo mantenimiento";
            case "Salida Mantenimiento":
                return "tipo salida";
            case "Baja":
                return "tipo baja";
            case "Entrada":
                return "tipo entrada";
            default:
                return "tipo";
        }
    }

    return (
        <section className="dashboard-page">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <p>Resumen general del sistema de gestión de activos TI.</p>
            </div>

            {error && <p className="dashboard-alert error">{error}</p>}

            {cargando ? (
                <p className="dashboard-loading">Cargando dashboard...</p>
            ) : (
                <>
                    {resumen && (
                        <div className="dashboard-resumen">
                            <div className="dashboard-card">
                                <span>Total equipos</span>
                                <strong>{resumen.total_equipos}</strong>
                            </div>

                            <div className="dashboard-card asignado">
                                <span>Asignados</span>
                                <strong>{resumen.asignados}</strong>
                            </div>

                            <div className="dashboard-card disponible">
                                <span>Disponibles</span>
                                <strong>{resumen.disponibles}</strong>
                            </div>

                            <div className="dashboard-card mantenimiento">
                                <span>Mantenimiento</span>
                                <strong>{resumen.mantenimiento}</strong>
                            </div>

                            <div className="dashboard-card baja">
                                <span>Baja</span>
                                <strong>{resumen.baja}</strong>
                            </div>
                        </div>
                    )}

                    <div className="dashboard-panel">
                        <div className="dashboard-panel-header">
                            <h3>Movimientos recientes</h3>
                            <p>Últimos registros realizados en el sistema.</p>
                        </div>

                        <div className="dashboard-tabla-wrapper">
                            <table className="dashboard-tabla">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Código</th>
                                        <th>Producto</th>
                                        <th>Tipo</th>
                                        <th>Registrado por</th>
                                        <th>Destino</th>
                                        <th>Motivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movimientos.length > 0 ? (
                                        movimientos.map((mov) => (
                                            <tr key={mov.id_movimiento}>
                                                <td>{formatearFecha(mov.fecha_movimiento)}</td>
                                                <td>{mov.codigo_interno}</td>
                                                <td>{mov.nombre_producto}</td>
                                                <td>
                                                    <span className={getTipoClase(mov.tipo_movimiento)}>
                                                        {mov.tipo_movimiento}
                                                    </span>
                                                </td>
                                                <td>{mov.registrado_por}</td>
                                                <td>{mov.trabajador_destino || "No aplica"}</td>
                                                <td>{mov.motivo || "-"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="dashboard-vacio">
                                                No hay movimientos recientes.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}

export default Dashboard;