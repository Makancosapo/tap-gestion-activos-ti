import { apiGet } from "./api";

const API_URL = "http://localhost:3000/api";

export async function crearMovimiento(data) {
    const response = await fetch(`${API_URL}/movimientos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return response.json();
}

export function getTiposMovimiento() {
    return apiGet("/movimientos/tipos");
}

export function getTrabajadores() {
    return apiGet("/trabajadores");
}

export function getEquipos() {
    return apiGet("/equipos");
}