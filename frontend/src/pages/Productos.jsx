import { useEffect, useMemo, useState } from "react";
import { crearProducto, getProductos } from "../services/productos.service";
import "../styles/productos.css";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const [form, setForm] = useState({
        nombre_producto: "",
        descripcion: "",
        marca: "",
        modelo: "",
        id_categoria: "",
    });

    const categorias = [
        { id: 1, nombre: "Notebook" },
        { id: 2, nombre: "Monitor" },
        { id: 3, nombre: "Periferico" },
    ];

    useEffect(() => {
        cargarProductos();
    }, []);

    async function cargarProductos() {
        try {
            setCargando(true);
            setError("");

            const response = await getProductos();
            setProductos(response.data || []);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los productos");
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
                id_categoria: Number(form.id_categoria),
            };

            const response = await crearProducto(payload);

            if (!response.ok) {
                setError(response.message || "No se pudo registrar el producto");
                return;
            }

            setMensaje(response.message || "Producto registrado correctamente");

            setForm({
                nombre_producto: "",
                descripcion: "",
                marca: "",
                modelo: "",
                id_categoria: "",
            });

            await cargarProductos();
        } catch (err) {
            console.error(err);
            setError("Error al registrar el producto");
        }
    }

    const productosFiltrados = useMemo(() => {
        if (!busqueda.trim()) return productos;

        const texto = busqueda.toLowerCase();

        return productos.filter((producto) =>
            [
                producto.nombre_producto,
                producto.descripcion,
                producto.marca,
                producto.modelo,
                producto.categoria,
            ]
                .join(" ")
                .toLowerCase()
                .includes(texto)
        );
    }, [productos, busqueda]);

    return (
        <section className="productos-page">
            <div className="productos-header">
                <h2>Productos</h2>
                <p>Administra el catálogo base de productos del sistema.</p>
            </div>

            {mensaje && <p className="productos-alert success">{mensaje}</p>}
            {error && <p className="productos-alert error">{error}</p>}

            <div className="productos-layout">
                <form className="productos-form" onSubmit={handleSubmit}>
                    <h3>Registrar producto</h3>

                    <div className="productos-field">
                        <label>Nombre del producto</label>
                        <input
                            type="text"
                            name="nombre_producto"
                            value={form.nombre_producto}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="productos-field">
                        <label>Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="productos-field">
                        <label>Marca</label>
                        <input
                            type="text"
                            name="marca"
                            value={form.marca}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="productos-field">
                        <label>Modelo</label>
                        <input
                            type="text"
                            name="modelo"
                            value={form.modelo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="productos-field">
                        <label>Categoría</label>
                        <select
                            name="id_categoria"
                            value={form.id_categoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="productos-submit" type="submit">
                        Guardar producto
                    </button>
                </form>

                <div className="productos-panel">
                    <div className="productos-toolbar">
                        <h3>Listado de productos</h3>
                        <input
                            type="text"
                            placeholder="Buscar producto"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    {cargando ? (
                        <p className="productos-loading">Cargando productos...</p>
                    ) : (
                        <div className="productos-tabla-wrapper">
                            <table className="productos-tabla">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Marca</th>
                                        <th>Modelo</th>
                                        <th>Categoría</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosFiltrados.length > 0 ? (
                                        productosFiltrados.map((producto) => (
                                            <tr key={producto.id_producto}>
                                                <td>{producto.nombre_producto}</td>
                                                <td>{producto.marca}</td>
                                                <td>{producto.modelo}</td>
                                                <td>{producto.categoria}</td>
                                                <td>{producto.descripcion || "-"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="productos-vacio">
                                                No se encontraron productos.
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

export default Productos;