import { useEffect, useState } from "react";
import {
    getReporteMovimientos,
    exportarReporteMovimientosCSV,
    getTrabajadoresReporte,
    getTiposMovimientoReporte,
} from "../services/reportes.service";
import "../styles/reportes.css";

function Reportes() {
    const hoy = new Date().toISOString().split("T")[0];

    const [trabajadores, setTrabajadores] = useState([]);
    const [tiposMovimiento, setTiposMovimiento] = useState([]);
    const [movimientos, setMovimientos] = useState([]);

    const [filtros, setFiltros] = useState({
        id_trabajador: "",
        id_tipo_movimiento: "",
        fecha_desde: "",
        fecha_hasta: hoy,
    });

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);
    const [buscando, setBuscando] = useState(false);

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    async function cargarDatosIniciales() {
        try {
            setCargando(true);
            setError("");

            const [trabajadoresRes, tiposRes, movimientosRes] = await Promise.all([
                getTrabajadoresReporte(),
                getTiposMovimientoReporte(),
                getReporteMovimientos({ fecha_hasta: hoy }),
            ]);

            setTrabajadores(trabajadoresRes.data || []);
            setTiposMovimiento(tiposRes.data || []);
            setMovimientos(movimientosRes.data || []);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los datos del módulo de informes.");
        } finally {
            setCargando(false);
        }
    }

    async function buscarReportes(e) {
        e?.preventDefault?.();

        if (
            filtros.fecha_desde &&
            filtros.fecha_hasta &&
            filtros.fecha_desde > filtros.fecha_hasta
        ) {
            setError("La fecha desde no puede ser mayor que la fecha hasta.");
            return;
        }

        try {
            setBuscando(true);
            setError("");

            const response = await getReporteMovimientos(filtros);
            setMovimientos(response.data || []);
        } catch (err) {
            console.error(err);
            setError("No se pudo generar el informe.");
        } finally {
            setBuscando(false);
        }
    }

    function handleFiltroChange(e) {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function manejarLimpiarYBuscar() {
        const nuevosFiltros = {
            id_trabajador: "",
            id_tipo_movimiento: "",
            fecha_desde: "",
            fecha_hasta: hoy,
        };

        setFiltros(nuevosFiltros);

        try {
            setBuscando(true);
            setError("");

            const response = await getReporteMovimientos(nuevosFiltros);
            setMovimientos(response.data || []);
        } catch (err) {
            console.error(err);
            setError("No se pudo recargar el informe.");
        } finally {
            setBuscando(false);
        }
    }

    function formatearFecha(fecha) {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleString("es-CL");
    }

    function exportarCSV() {
        exportarReporteMovimientosCSV(movimientos);
    }

    return (
        <section className="reportes-page">
            <div className="reportes-top">
                <div>
                    <h1 className="reportes-title">Informes</h1>
                    <p className="reportes-description">
                        Genere consultas sobre los movimientos registrados aplicando filtros por trabajador,
                        tipo de movimiento y rango de fechas.
                    </p>
                </div>

                <button
                    className="reportes-btn reportes-btn-outline"
                    onClick={exportarCSV}
                    disabled={movimientos.length === 0}
                >
                    Exportar CSV
                </button>
            </div>

            {error && <div className="reportes-alert error">{error}</div>}

            {cargando ? (
                <div className="reportes-card">
                    <p className="reportes-loading">Cargando informe...</p>
                </div>
            ) : (
                <>
                    <div className="reportes-card">
                        <div className="reportes-card-header">
                            <div>
                                <h2>Filtros de consulta</h2>
                                <p>Defina los criterios para generar el informe.</p>
                            </div>
                        </div>

                        <form className="reportes-filtros" onSubmit={buscarReportes}>
                            <div className="reportes-campo">
                                <label htmlFor="id_trabajador">Trabajador</label>
                                <select
                                    id="id_trabajador"
                                    name="id_trabajador"
                                    value={filtros.id_trabajador}
                                    onChange={handleFiltroChange}
                                >
                                    <option value="">Todos</option>
                                    {trabajadores.map((trabajador) => (
                                        <option
                                            key={trabajador.id_trabajador}
                                            value={trabajador.id_trabajador}
                                        >
                                            {trabajador.nombre} {trabajador.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="reportes-campo">
                                <label htmlFor="id_tipo_movimiento">Tipo de movimiento</label>
                                <select
                                    id="id_tipo_movimiento"
                                    name="id_tipo_movimiento"
                                    value={filtros.id_tipo_movimiento}
                                    onChange={handleFiltroChange}
                                >
                                    <option value="">Todos</option>
                                    {tiposMovimiento.map((tipo) => (
                                        <option
                                            key={tipo.id_tipo_movimiento}
                                            value={tipo.id_tipo_movimiento}
                                        >
                                            {tipo.descripcion_tipo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="reportes-campo">
                                <label htmlFor="fecha_desde">Fecha desde</label>
                                <input
                                    id="fecha_desde"
                                    type="date"
                                    name="fecha_desde"
                                    value={filtros.fecha_desde}
                                    onChange={handleFiltroChange}
                                />
                            </div>

                            <div className="reportes-campo">
                                <label htmlFor="fecha_hasta">Fecha hasta</label>
                                <input
                                    id="fecha_hasta"
                                    type="date"
                                    name="fecha_hasta"
                                    value={filtros.fecha_hasta}
                                    onChange={handleFiltroChange}
                                />
                            </div>

                            <div className="reportes-acciones">
                                <button
                                    type="submit"
                                    className="reportes-btn reportes-btn-primary"
                                    disabled={buscando}
                                >
                                    {buscando ? "Consultando..." : "Generar informe"}
                                </button>

                                <button
                                    type="button"
                                    className="reportes-btn reportes-btn-secondary"
                                    onClick={manejarLimpiarYBuscar}
                                    disabled={buscando}
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="reportes-card">
                        <div className="reportes-card-header reportes-card-header-results">
                            <div>
                                <h2>Resultados</h2>
                                <p>Visualización de registros según filtros aplicados.</p>
                            </div>

                            <div className="reportes-badge">
                                {movimientos.length} registros
                            </div>
                        </div>

                        <div className="reportes-tabla-wrapper">
                            <table className="reportes-tabla">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Código</th>
                                        <th>Producto</th>
                                        <th>Tipo</th>
                                        <th>Registrado por</th>
                                        <th>Trabajador</th>
                                        <th>Motivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movimientos.length > 0 ? (
                                        movimientos.map((mov) => (
                                            <tr key={mov.id_movimiento}>
                                                <td>{formatearFecha(mov.fecha_movimiento)}</td>
                                                <td>
                                                    <span className="codigo-chip">
                                                        {mov.codigo_interno}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="producto-nombre">{mov.nombre_producto}</div>
                                                    <div className="reportes-subtexto">
                                                        {mov.marca} {mov.modelo}
                                                    </div>
                                                </td>
                                                <td>{mov.tipo_movimiento}</td>
                                                <td>{mov.registrado_por}</td>
                                                <td>{mov.trabajador_relacionado || "No aplica"}</td>
                                                <td>{mov.motivo || "-"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="reportes-vacio">
                                                No hay registros para los filtros seleccionados.
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

export default Reportes;