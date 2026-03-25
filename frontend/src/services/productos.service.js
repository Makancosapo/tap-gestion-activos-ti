import { apiGet } from "./api";

const API_URL = "http://localhost:3000/api";

export function getProductos() {
    return apiGet("/productos");
}

export async function crearProducto(data) {
    const response = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return response.json();
}