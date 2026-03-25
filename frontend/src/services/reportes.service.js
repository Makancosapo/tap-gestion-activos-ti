import { apiGet } from "./api";

function construirQueryParams(filtros = {}) {
    const params = new URLSearchParams();

    if (filtros.id_trabajador) {
        params.append("id_trabajador", filtros.id_trabajador);
    }

    if (filtros.id_tipo_movimiento) {
        params.append("id_tipo_movimiento", filtros.id_tipo_movimiento);
    }

    if (filtros.fecha_desde) {
        params.append("fecha_desde", filtros.fecha_desde);
    }

    if (filtros.fecha_hasta) {
        params.append("fecha_hasta", filtros.fecha_hasta);
    }

    const query = params.toString();
    return query ? `?${query}` : "";
}

export function getReporteMovimientos(filtros = {}) {
    return apiGet(`/reportes/movimientos${construirQueryParams(filtros)}`);
}

export function getTrabajadoresReporte() {
    return apiGet("/trabajadores");
}

export function getTiposMovimientoReporte() {
    return apiGet("/movimientos/tipos");
}

export function exportarReporteMovimientosCSV(registros = []) {
    const filas = [
        [
            "Fecha",
            "Código",
            "Producto",
            "Marca",
            "Modelo",
            "Tipo de movimiento",
            "Registrado por",
            "Trabajador relacionado",
            "Motivo",
        ],
        ...registros.map((item) => [
            item.fecha_movimiento || "",
            item.codigo_interno || "",
            item.nombre_producto || "",
            item.marca || "",
            item.modelo || "",
            item.tipo_movimiento || "",
            item.registrado_por || "",
            item.trabajador_relacionado || "",
            item.motivo || "",
        ]),
    ];

    const contenido = filas
        .map((fila) =>
            fila.map((col) => `"${String(col ?? "").replaceAll('"', '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "informe_movimientos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}