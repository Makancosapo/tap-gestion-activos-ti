import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHistorialPorEquipo } from "../services/historial.service";
import "../styles/historial.css";

function HistorialEquipo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [historial, setHistorial] = useState([]);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        cargarHistorial();
    }, [id]);

    async function cargarHistorial() {
        try {
            setCargando(true);
            setError("");

            const response = await getHistorialPorEquipo(id);
            setHistorial(response.data || []);
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar el historial del equipo");
        } finally {
            setCargando(false);
        }
    }

    function formatearFecha(fecha) {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleString("es-CL");
    }

    const detalleEquipo = historial.length > 0 ? historial[0] : null;

    return (
        <section className="historial-page">
            <div className="historial-header">
                <div>
                    <h2>Historial del equipo</h2>
                    <p>Consulta los movimientos registrados para el equipo seleccionado.</p>
                </div>

                <button className="historial-back" onClick={() => navigate("/inventario")}>
                    Volver a inventario
                </button>
            </div>

            {detalleEquipo && (
                <div className="historial-card">
                    <p>
                        <strong>Código:</strong> {detalleEquipo.codigo_interno}
                    </p>
                    <p>
                        <strong>Serie:</strong> {detalleEquipo.numero_serie}
                    </p>
                    <p>
                        <strong>Producto:</strong> {detalleEquipo.nombre_producto}
                    </p>
                    <p>
                        <strong>Categoría:</strong> {detalleEquipo.categoria}
                    </p>
                </div>
            )}

            {error && <p className="historial-alert error">{error}</p>}

            {cargando ? (
                <p className="historial-loading">Cargando historial...</p>
            ) : (
                <div className="historial-tabla-wrapper">
                    <table className="historial-tabla">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo movimiento</th>
                                <th>Registrado por</th>
                                <th>Trabajador destino</th>
                                <th>Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial.length > 0 ? (
                                historial.map((item) => (
                                    <tr key={item.id_movimiento}>
                                        <td>{formatearFecha(item.fecha_movimiento)}</td>
                                        <td>{item.tipo_movimiento}</td>
                                        <td>{item.registrado_por}</td>
                                        <td>{item.trabajador_destino || "No aplica"}</td>
                                        <td>{item.motivo || "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="historial-vacio">
                                        No hay movimientos registrados para este equipo.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default HistorialEquipo;