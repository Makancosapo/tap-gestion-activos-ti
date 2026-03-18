
import { apiGet } from './api'

export function getResumenDashboard() {
    return apiGet('/dashboard/resumen')
}

export function getMovimientosRecientes() {
    return apiGet('/dashboard/movimientos-recientes')
}

