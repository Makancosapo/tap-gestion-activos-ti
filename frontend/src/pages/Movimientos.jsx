import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    crearMovimiento,
    getTiposMovimiento,
    getTrabajadores,
    getEquipos,
} from "../services/movimientos.service";
import "../styles/movimientos.css";

function Movimientos() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [equipos, setEquipos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [trabajadores, setTrabajadores] = useState([]);

    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        id_equipo: "",
        id_tipo_movimiento: "",
        id_trabajador_registra: 1,
        id_trabajador_destino: "",
        motivo: "",
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {
        try {
            setError("");

            const [equiposRes, tiposRes, trabajadoresRes] = await Promise.all([
                getEquipos(),
                getTiposMovimiento(),
                getTrabajadores(),
            ]);

            const equiposData = equiposRes.data || [];
            const tiposData = tiposRes.data || [];
            const trabajadoresData = trabajadoresRes.data || [];

            setEquipos(equiposData);
            setTipos(tiposData);
            setTrabajadores(trabajadoresData);

            const idEquipoUrl = searchParams.get("id_equipo");

            if (idEquipoUrl) {
                const equipo = equiposData.find(
                    (item) => String(item.id_equipo) === String(idEquipoUrl)
                );

                if (equipo) {
                    setEquipoSeleccionado(equipo);
                    setCategoriaFiltro(equipo.categoria || "");
                    setForm((prev) => ({
                        ...prev,
                        id_equipo: String(equipo.id_equipo),
                    }));
                }
            }
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los datos del formulario");
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

    function handleCategoriaChange(e) {
        const nuevaCategoria = e.target.value;

        setCategoriaFiltro(nuevaCategoria);
        setEquipoSeleccionado(null);

        setForm((prev) => ({
            ...prev,
            id_equipo: "",
            id_tipo_movimiento: "",
            id_trabajador_destino: "",
        }));

        setMensaje("");
        setError("");
    }

    function handleEquipoChange(e) {
        const id = e.target.value;

        const equipo = equipos.find(
            (item) => String(item.id_equipo) === String(id)
        );

        setForm((prev) => ({
            ...prev,
            id_equipo: id,
            id_tipo_movimiento: "",
            id_trabajador_destino: "",
        }));

        setEquipoSeleccionado(equipo || null);
        setMensaje("");
        setError("");
    }

    const categorias = useMemo(() => {
        return [...new Set(equipos.map((e) => e.categoria).filter(Boolean))];
    }, [equipos]);

    const equiposFiltrados = useMemo(() => {
        if (!categoriaFiltro) return equipos;
        return equipos.filter((e) => e.categoria === categoriaFiltro);
    }, [equipos, categoriaFiltro]);

    const tiposFiltrados = useMemo(() => {
        if (!equipoSeleccionado) return [];

        const estado = equipoSeleccionado.estado;

        return tipos.filter((tipo) => {
            switch (estado) {
                case "Disponible":
                    return ["Asignacion", "Mantenimiento", "Baja"].includes(
                        tipo.descripcion_tipo
                    );
                case "Asignado":
                    return ["Devolucion", "Mantenimiento", "Baja"].includes(
                        tipo.descripcion_tipo
                    );
                case "En mantenimiento":
                    return ["Salida Mantenimiento", "Baja"].includes(
                        tipo.descripcion_tipo
                    );
                case "Dado de baja":
                    return false;
                default:
                    return true;
            }
        });
    }, [tipos, equipoSeleccionado]);

    const tipoSeleccionado = useMemo(() => {
        return tipos.find(
            (tipo) =>
                String(tipo.id_tipo_movimiento) === String(form.id_tipo_movimiento)
        );
    }, [tipos, form.id_tipo_movimiento]);

    const requiereTrabajadorDestino =
        tipoSeleccionado?.descripcion_tipo === "Asignacion";

    function getEstadoResultado(tipo) {
        switch (tipo) {
            case "Asignacion":
                return "Asignado";
            case "Devolucion":
                return "Disponible";
            case "Mantenimiento":
                return "En mantenimiento";
            case "Salida Mantenimiento":
                return "Disponible";
            case "Baja":
                return "Dado de baja";
            default:
                return "-";
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMensaje("");
        setError("");

        try {
            const payload = {
                id_equipo: Number(form.id_equipo),
                id_tipo_movimiento: Number(form.id_tipo_movimiento),
                id_trabajador_registra: Number(form.id_trabajador_registra),
                id_trabajador_destino: requiereTrabajadorDestino
                    ? Number(form.id_trabajador_destino)
                    : null,
                motivo: form.motivo?.trim() || null,
            };

            const response = await crearMovimiento(payload);

            if (!response.ok) {
                setError(response.message || "No se pudo registrar el movimiento");
                return;
            }

            navigate(`/inventario?equipo=${form.id_equipo}&actualizado=1`);
        } catch (err) {
            console.error(err);
            setError("Error al registrar movimiento");
        }
    }

    return (
        <section className="movimientos-page">
            <div className="movimientos-header">
                <h2>Registrar Movimiento</h2>
                <p>Registra asignaciones, devoluciones, mantenimiento y bajas.</p>
            </div>

            {mensaje && <p className="movimientos-alert success">{mensaje}</p>}
            {error && <p className="movimientos-alert error">{error}</p>}

            <form className="movimientos-form" onSubmit={handleSubmit}>
                <div className="movimientos-field">
                    <label>Filtrar por categoría</label>
                    <select value={categoriaFiltro} onChange={handleCategoriaChange}>
                        <option value="">Todas</option>
                        {categorias.map((categoria) => (
                            <option key={categoria} value={categoria}>
                                {categoria}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="movimientos-field">
                    <label>Equipo</label>
                    <select
                        name="id_equipo"
                        value={form.id_equipo}
                        onChange={handleEquipoChange}
                        required
                    >
                        <option value="">Seleccione un equipo</option>
                        {equiposFiltrados.map((equipo) => (
                            <option key={equipo.id_equipo} value={equipo.id_equipo}>
                                {equipo.codigo_interno} | {equipo.nombre_producto} |{" "}
                                {equipo.numero_serie} | {equipo.estado}
                            </option>
                        ))}
                    </select>
                </div>

                {equipoSeleccionado && (
                    <div className="movimientos-card">
                        <strong>Detalle del equipo</strong>
                        <p>
                            <span>Código:</span> {equipoSeleccionado.codigo_interno}
                        </p>
                        <p>
                            <span>Producto:</span> {equipoSeleccionado.nombre_producto}
                        </p>
                        <p>
                            <span>Categoría:</span> {equipoSeleccionado.categoria}
                        </p>
                        <p>
                            <span>Serie:</span> {equipoSeleccionado.numero_serie}
                        </p>
                        <p>
                            <span>Estado actual:</span> {equipoSeleccionado.estado}
                        </p>
                        <p>
                            <span>Empleado asignado:</span>{" "}
                            {equipoSeleccionado.empleado_asignado || "No asignado"}
                        </p>
                    </div>
                )}

                <div className="movimientos-field">
                    <label>Tipo de movimiento</label>
                    <select
                        name="id_tipo_movimiento"
                        value={form.id_tipo_movimiento}
                        onChange={handleChange}
                        required
                        disabled={!equipoSeleccionado}
                    >
                        <option value="">Seleccione un tipo</option>
                        {tiposFiltrados.map((tipo) => (
                            <option
                                key={tipo.id_tipo_movimiento}
                                value={tipo.id_tipo_movimiento}
                            >
                                {tipo.descripcion_tipo}
                            </option>
                        ))}
                    </select>
                </div>

                {tipoSeleccionado && (
                    <div className="movimientos-estado">
                        <strong>Nuevo estado esperado:</strong>{" "}
                        {getEstadoResultado(tipoSeleccionado.descripcion_tipo)}
                    </div>
                )}

                {requiereTrabajadorDestino && (
                    <div className="movimientos-field">
                        <label>Trabajador destino</label>
                        <select
                            name="id_trabajador_destino"
                            value={form.id_trabajador_destino}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un trabajador</option>
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
                )}

                <div className="movimientos-field">
                    <label>Motivo</label>
                    <input
                        type="text"
                        name="motivo"
                        value={form.motivo}
                        onChange={handleChange}
                        placeholder="Ingrese un motivo u observación"
                    />
                </div>

                <button
                    className="movimientos-submit"
                    type="submit"
                    disabled={!form.id_equipo || !form.id_tipo_movimiento}
                >
                    Guardar movimiento
                </button>
            </form>
        </section>
    );
}

export default Movimientos;