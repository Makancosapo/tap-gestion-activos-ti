import { apiGet } from "./api";

const API_URL = "http://localhost:3000/api";

export function getEquipos() {
    return apiGet("/equipos");
}

export async function crearEquipo(data) {
    const response = await fetch(`${API_URL}/equipos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return response.json();
}