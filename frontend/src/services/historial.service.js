import { apiGet } from "./api";

export function getHistorialPorEquipo(idEquipo) {
    return apiGet(`/movimientos/equipo/${idEquipo}/historial`);
}