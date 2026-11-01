import type { SMNData, SMNAlert, SMNAlertLevel } from '@/types'

// Río Cuarto — zona SMN: Córdoba sur / id de estación 87532
// https://api.smn.gob.ar/v2/weather/location/87532
const SMN_BASE = 'https://api.smn.gob.ar/v2'
const RIO_CUARTO_STATION = '87532'
const RIO_CUARTO_ZONE = 'CBA_SUR' // zona de alertas para Córdoba sur

export async function fetchSMNData(): Promise<SMNData> {
  const [alertsRes, forecastRes] = await Promise.allSettled([
    fetch(`${SMN_BASE}/weather/alert`),
    fetch(`${SMN_BASE}/weather/location/${RIO_CUARTO_STATION}`),
  ])

  const alerts: SMNAlert[] = []

  if (alertsRes.status === 'fulfilled' && alertsRes.value.ok) {
    try {
      const raw = await alertsRes.value.json()
      const items = Array.isArray(raw) ? raw : (raw.data ?? [])
      for (const item of items) {
        if (!item.zones?.includes(RIO_CUARTO_ZONE)) continue
        alerts.push(normalizeSMNAlert(item))
      }
    } catch {
      // API no disponible — continúa sin alertas
    }
  }

  const forecasts = []
  if (forecastRes.status === 'fulfilled' && forecastRes.value.ok) {
    try {
      const raw = await forecastRes.value.json()
      const items = raw.forecast ?? []
      for (const item of items.slice(0, 3)) {
        forecasts.push({
          date: item.date,
          temp_max: item.tempMax,
          temp_min: item.tempMin,
          description: item.description ?? '',
          icon: item.icon ?? '',
        })
      }
    } catch {
      // continúa sin pronóstico
    }
  }

  return { alerts, forecasts, fetched_at: new Date().toISOString() }
}

function normalizeSMNAlert(raw: Record<string, unknown>): SMNAlert {
  const levelMap: Record<string, SMNAlertLevel> = {
    yellow: 'amarillo',
    amarillo: 'amarillo',
    orange: 'naranja',
    naranja: 'naranja',
    red: 'rojo',
    rojo: 'rojo',
  }
  const rawLevel = String(raw.level ?? raw.nivel ?? '').toLowerCase()
  return {
    id: String(raw.id ?? Math.random()),
    level: levelMap[rawLevel] ?? 'amarillo',
    phenomenon: String(raw.phenomenon ?? raw.fenomeno ?? ''),
    description: String(raw.description ?? raw.descripcion ?? ''),
    valid_from: String(raw.validFrom ?? raw.desde ?? ''),
    valid_to: String(raw.validTo ?? raw.hasta ?? ''),
    zone: RIO_CUARTO_ZONE,
  }
}

export const SMN_ALERT_COLORS: Record<SMNAlertLevel, { bg: string; text: string; border: string }> = {
  amarillo: {
    bg: 'bg-yellow-400',
    text: 'text-yellow-900',
    border: 'border-yellow-500',
  },
  naranja: {
    bg: 'bg-orange-500',
    text: 'text-white',
    border: 'border-orange-600',
  },
  rojo: {
    bg: 'bg-red-600',
    text: 'text-white',
    border: 'border-red-700',
  },
}

// Medidas de prevención por fenómeno
export const PREVENTION_MEASURES: Record<string, string[]> = {
  default: [
    'Mantenete informado a través del SMN',
    'Descargá la app del SMN para alertas en tiempo real',
    'Evitá circular si no es necesario durante el evento',
    'Alejate de árboles y estructuras inestables',
  ],
  tormenta: [
    'Buscá refugio en un edificio sólido',
    'Alejate de ventanas y puertas',
    'No usés aparatos eléctricos conectados',
    'Evitá cuerpos de agua y espacios abiertos',
    'Si estás manejando, detenete en un lugar seguro',
  ],
  viento: [
    'Asegurá objetos sueltos en patios y balcones',
    'Evitá estar bajo árboles o carteles',
    'No estaciones vehículos bajo árboles o estructuras',
    'Mantené distancia de cables eléctricos',
  ],
  lluvia: [
    'Evitá circular por zonas inundables',
    'No cruzés arroyos o cauces crecidos',
    'Alejate de sótanos que puedan inundarse',
    'Preparate con elementos de emergencia',
  ],
  calor: [
    'Hidratate con agua frecuentemente',
    'Evitá salir en las horas más calurosas (12 a 16 hs)',
    'Usá ropa liviana y de colores claros',
    'No dejés personas ni animales en vehículos cerrados',
  ],
  frio: [
    'Abrigate en capas de ropa',
    'Revisá la calefacción y ventilación del hogar',
    'Prestá atención a personas mayores y niños',
    'Evitá la exposición prolongada al frío',
  ],
}

export function getPreventionMeasures(phenomenon: string): string[] {
  const key = Object.keys(PREVENTION_MEASURES).find(k =>
    phenomenon.toLowerCase().includes(k)
  )
  return PREVENTION_MEASURES[key ?? 'default']
}
