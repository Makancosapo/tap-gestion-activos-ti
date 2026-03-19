import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    getInventario,
    buscarInventario,
} from "../services/inventario.service";
import "../styles/inventario.css";

function Inventario() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const filaRefs = useRef({});

    const [inventario, setInventario] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const equipoDestacado = searchParams.get("equipo");
    const actualizado = searchParams.get("actualizado");

    // =========================
    // CARGA INICIAL
    // =========================
    useEffect(() => {
        cargarInventario();
    }, []);

    // =========================
    // MEMOS (ANTES DE USEEFFECT)
    // =========================
    const categorias = useMemo(() => {
        return [...new Set(inventario.map((i) => i.categoria).filter(Boolean))];
    }, [inventario]);

    const estados = useMemo(() => {
        return [...new Set(inventario.map((i) => i.estado).filter(Boolean))];
    }, [inventario]);

    const inventarioFiltrado = useMemo(() => {
        return inventario.filter((item) => {
            const okCategoria = categoriaFiltro
                ? item.categoria === categoriaFiltro
                : true;

            const okEstado = estadoFiltro
                ? item.estado === estadoFiltro
                : true;

            return okCategoria && okEstado;
        });
    }, [inventario, categoriaFiltro, estadoFiltro]);

    const resumen = useMemo(() => {
        return {
            total: inventario.length,
            disponibles: inventario.filter((i) => i.estado === "Disponible").length,
            asignados: inventario.filter((i) => i.estado === "Asignado").length,
            mantenimiento: inventario.filter((i) => i.estado === "En mantenimiento")
                .length,
            baja: inventario.filter((i) => i.estado === "Dado de baja").length,
        };
    }, [inventario]);

    // =========================
    // EFECTOS (DESPUÉS DE MEMOS)
    // =========================
    useEffect(() => {
        if (equipoDestacado && inventarioFiltrado.length > 0) {
            const fila = filaRefs.current[equipoDestacado];
            if (fila) {
                fila.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [equipoDestacado, inventarioFiltrado]);

    useEffect(() => {
        if (actualizado === "1") {
            const timer = setTimeout(() => {
                navigate("/inventario", { replace: true });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [actualizado, navigate]);

    // =========================
    // FUNCIONES
    // =========================
    async function cargarInventario() {
        try {
            setCargando(true);
            setError("");

            const response = await getInventario();
            setInventario(response.data || []);
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar el inventario");
        } finally {
            setCargando(false);
        }
    }

    async function handleBuscar(e) {
        e.preventDefault();

        try {
            setCargando(true);
            setError("");

            if (!busqueda.trim()) {
                await cargarInventario();
                return;
            }

            const response = await buscarInventario(busqueda.trim());
            setInventario(response.data || []);
        } catch (err) {
            console.error(err);
            setError("Error al buscar");
        } finally {
            setCargando(false);
        }
    }

    function limpiarFiltros() {
        setBusqueda("");
        setCategoriaFiltro("");
        setEstadoFiltro("");
        cargarInventario();
    }

    function formatearFecha(fecha) {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleDateString("es-CL");
    }

    function getEstadoClase(estado) {
        switch (estado) {
            case "Disponible":
                return "estado disponible";
            case "Asignado":
                return "estado asignado";
            case "En mantenimiento":
                return "estado mantenimiento";
            case "Dado de baja":
                return "estado baja";
            default:
                return "estado";
        }
    }

    function verHistorial(id) {
        navigate(`/movimientos/historial/${id}`);
    }

    function registrarMovimiento(id) {
        navigate(`/movimientos?id_equipo=${id}`);
    }

    // =========================
    // RENDER
    // =========================
    return (
        <section className="inventario-page">
            <div className="inventario-header">
                <h2>Inventario</h2>
                <p>Consulta y administra los equipos registrados</p>
            </div>

            {/* RESUMEN */}
            <div className="inventario-resumen">
                <div className="resumen-card">
                    <span>Total</span>
                    <strong>{resumen.total}</strong>
                </div>
                <div className="resumen-card disponible">
                    <span>Disponibles</span>
                    <strong>{resumen.disponibles}</strong>
                </div>
                <div className="resumen-card asignado">
                    <span>Asignados</span>
                    <strong>{resumen.asignados}</strong>
                </div>
                <div className="resumen-card mantenimiento">
                    <span>Mantenimiento</span>
                    <strong>{resumen.mantenimiento}</strong>
                </div>
                <div className="resumen-card baja">
                    <span>Baja</span>
                    <strong>{resumen.baja}</strong>
                </div>
            </div>

            {/* BUSQUEDA */}
            <form className="inventario-busqueda" onSubmit={handleBuscar}>
                <input
                    type="text"
                    placeholder="Buscar por código o serie"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button type="submit">Buscar</button>
                <button type="button" onClick={limpiarFiltros}>
                    Limpiar
                </button>
            </form>

            {/* FILTROS */}
            <div className="inventario-filtros">
                <select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>

                <select
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                >
                    <option value="">Todos los estados</option>
                    {estados.map((e) => (
                        <option key={e}>{e}</option>
                    ))}
                </select>
            </div>

            {/* ALERTA */}
            {actualizado === "1" && (
                <p className="inventario-alert success">
                    Movimiento registrado correctamente
                </p>
            )}

            {error && <p className="inventario-alert error">{error}</p>}

            {/* TABLA */}
            {cargando ? (
                <p>Cargando...</p>
            ) : (
                <table className="inventario-tabla">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Serie</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Empleado</th>
                            <th>Ingreso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {inventarioFiltrado.length > 0 ? (
                            inventarioFiltrado.map((item) => (
                                <tr
                                    key={item.id_equipo}
                                    ref={(el) => (filaRefs.current[item.id_equipo] = el)}
                                    className={
                                        String(item.id_equipo) === String(equipoDestacado)
                                            ? "fila-destacada"
                                            : ""
                                    }
                                >
                                    <td>{item.codigo_interno}</td>
                                    <td>{item.numero_serie}</td>
                                    <td>{item.nombre_producto}</td>
                                    <td>{item.categoria}</td>
                                    <td>
                                        <span className={getEstadoClase(item.estado)}>
                                            {item.estado}
                                        </span>
                                    </td>
                                    <td>{item.empleado_asignado || "No asignado"}</td>
                                    <td>{formatearFecha(item.fecha_ingreso)}</td>
                                    <td>
                                        <div className="acciones-cell">
                                            <button
                                                type="button"
                                                className="accion-btn"
                                                onClick={() => verHistorial(item.id_equipo)}
                                            >
                                                Historial
                                            </button>

                                            <button
                                                type="button"
                                                className="accion-btn secondary"
                                                onClick={() => registrarMovimiento(item.id_equipo)}
                                            >
                                                Movimiento
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Sin resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </section>
    );
}

export default Inventario;