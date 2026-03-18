import { apiGet } from './api'

export function getInventario() {
    return apiGet('/inventario')
}

export function buscarInventario(q) {
    return apiGet(`/inventario/buscar?q=${encodeURIComponent(q)}`)
}