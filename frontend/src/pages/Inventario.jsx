import { useEffect, useState } from "react";
import { getInventario, buscarInventario } from "../services/inventario.service";

function Inventario() {
    const [inventario, setInventario] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        cargarInventario();
    }, []);

    async function cargarInventario() {
        try {
            const response = await getInventario();
            setInventario(response.data);
        } catch (err) {
            setError("No se pudo cargar el inventario");
            console.error(err);
        }
    }

    async function handleBuscar(e) {
        e.preventDefault();

        try {
            if (!busqueda.trim()) {
                await cargarInventario();
                return;
            }

            const response = await buscarInventario(busqueda);
            setInventario(response.data);
        } catch (err) {
            setError("Error al buscar en inventario");
            console.error(err);
        }
    }

    return (
        <section>
            <h2>Inventario</h2>
            <p>Listado de equipos registrados.</p>

            <form onSubmit={handleBuscar} style={{ marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Buscar por código o número de serie"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button type="submit">Buscar</button>
            </form>

            {error && <p>{error}</p>}

            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Serie</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Estado</th>
                        <th>Empleado asignado</th>
                        <th>Fecha ingreso</th>
                    </tr>
                </thead>
                <tbody>
                    {inventario.map((item) => (
                        <tr key={item.id_equipo}>
                            <td>{item.codigo_interno}</td>
                            <td>{item.numero_serie}</td>
                            <td>{item.nombre_producto}</td>
                            <td>{item.categoria}</td>
                            <td>{item.estado}</td>
                            <td>{item.empleado_asignado || "-"}</td>
                            <td>{item.fecha_ingreso?.split("T")[0]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Inventario;