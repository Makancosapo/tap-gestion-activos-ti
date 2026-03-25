import { useEffect, useMemo, useState } from "react";
import { getProductos } from "../services/productos.service";
import { crearEquipo, getEquipos } from "../services/equipos.service";
import "../styles/equipos.css";

function Equipos() {
    const [equipos, setEquipos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const [form, setForm] = useState({
        id_producto: "",
        numero_serie: "",
        fecha_ingreso: "",
        observacion: "",
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {
        try {
            setCargando(true);
            setError("");

            const [equiposRes, productosRes] = await Promise.all([
                getEquipos(),
                getProductos(),
            ]);

            setEquipos(equiposRes.data || []);
            setProductos(productosRes.data || []);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los datos de equipos");
        } finally {
            setCargando(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setMensaje("");
        setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMensaje("");
        setError("");

        try {
            const payload = {
                ...form,
                id_producto: Number(form.id_producto),
            };

            const response = await crearEquipo(payload);

            if (!response.ok) {
                setError(response.message || "No se pudo registrar el equipo");
                return;
            }

            setMensaje(
                response.message
                    ? `${response.message} (${response.data?.codigo_interno || ""})`
                    : `Equipo registrado correctamente (${response.data?.codigo_interno || ""})`
            );

            setForm({
                id_producto: "",
                numero_serie: "",
                fecha_ingreso: "",
                observacion: "",
            });

            await cargarDatos();
        } catch (err) {
            console.error(err);
            setError("Error al registrar el equipo");
        }
    }

    const equiposFiltrados = useMemo(() => {
        if (!busqueda.trim()) return equipos;

        const texto = busqueda.toLowerCase();

        return equipos.filter((equipo) =>
            [
                equipo.codigo_interno,
                equipo.numero_serie,
                equipo.nombre_producto,
                equipo.categoria,
                equipo.estado,
            ]
                .join(" ")
                .toLowerCase()
                .includes(texto)
        );
    }, [equipos, busqueda]);

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

    function formatearFecha(fecha) {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleDateString("es-CL");
    }

    return (
        <section className="equipos-page">
            <div className="equipos-header">
                <h2>Equipos</h2>
                <p>Registra y consulta equipos físicos dentro del inventario.</p>
            </div>

            {mensaje && <p className="equipos-alert success">{mensaje}</p>}
            {error && <p className="equipos-alert error">{error}</p>}

            <div className="equipos-layout">
                <form className="equipos-form" onSubmit={handleSubmit}>
                    <h3>Registrar equipo</h3>

                    <div className="equipos-field">
                        <label>Producto</label>
                        <select
                            name="id_producto"
                            value={form.id_producto}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un producto</option>
                            {productos.map((producto) => (
                                <option key={producto.id_producto} value={producto.id_producto}>
                                    {producto.nombre_producto} | {producto.marca} {producto.modelo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="equipos-field">
                        <label>Número de serie</label>
                        <input
                            type="text"
                            name="numero_serie"
                            value={form.numero_serie}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="equipos-field">
                        <label>Fecha de ingreso</label>
                        <input
                            type="date"
                            name="fecha_ingreso"
                            value={form.fecha_ingreso}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="equipos-field">
                        <label>Observación</label>
                        <input
                            type="text"
                            name="observacion"
                            value={form.observacion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="equipos-info">
                        <p>
                            <strong>Código interno:</strong> se generará automáticamente
                        </p>
                        <p>
                            <strong>Estado inicial:</strong> Disponible
                        </p>
                    </div>

                    <button className="equipos-submit" type="submit">
                        Guardar equipo
                    </button>
                </form>

                <div className="equipos-panel">
                    <div className="equipos-toolbar">
                        <h3>Listado de equipos</h3>
                        <input
                            type="text"
                            placeholder="Buscar equipo"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {cargando ? (
                        <p className="equipos-loading">Cargando equipos...</p>
                    ) : (
                        <div className="equipos-tabla-wrapper">
                            <table className="equipos-tabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Serie</th>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Estado</th>
                                        <th>Ingreso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equiposFiltrados.length > 0 ? (
                                        equiposFiltrados.map((equipo) => (
                                            <tr key={equipo.id_equipo}>
                                                <td>{equipo.codigo_interno}</td>
                                                <td>{equipo.numero_serie}</td>
                                                <td>{equipo.nombre_producto}</td>
                                                <td>{equipo.categoria}</td>
                                                <td>
                                                    <span className={getEstadoClase(equipo.estado)}>
                                                        {equipo.estado}
                                                    </span>
                                                </td>
                                                <td>{formatearFecha(equipo.fecha_ingreso)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="equipos-vacio">
                                                No se encontraron equipos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Equipos;