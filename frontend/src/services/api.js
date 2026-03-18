const API_URL = 'http://localhost:3000/api'

export async function apiGet(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`)

    if (!response.ok) {
        throw new Error('Error al obtener datos del servidor')
    }

    return response.json()
}