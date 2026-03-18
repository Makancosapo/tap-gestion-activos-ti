import { NavLink } from 'react-router-dom'

function Sidebar() {
    return (
        <aside className="sidebar">
            <h2 className="logo">Sistema TI</h2>

            <nav className="menu">
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/inventario">Inventario</NavLink>
                <NavLink to="/productos">Productos</NavLink>
                <NavLink to="/equipos">Equipos</NavLink>
                <NavLink to="/movimientos">Movimientos</NavLink>
                <NavLink to="/reportes">Reportes</NavLink>
            </nav>
        </aside>
    )
}

export default Sidebar