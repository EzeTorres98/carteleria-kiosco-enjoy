import type { EnvContent, EnvCategory } from '@/types'

// Fuentes externas de contenido ambiental
// Todas las APIs son públicas y gratuitas

interface ExternalFact {
  category: EnvCategory
  title: string
  body: string
  source: string
  source_url?: string
}

// ── Open-Meteo: temperatura actual de Río Cuarto ──────────────────────────────
export async function fetchCurrentWeatherFact(): Promise<ExternalFact | null> {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-33.13&longitude=-64.35&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=America%2FArgentina%2FBuenos_Aires'
    )
    if (!res.ok) return null
    const data = await res.json()
    const temp = data.current?.temperature_2m
    const humidity = data.current?.relative_humidity_2m
    if (temp == null) return null
    return {
      category: 'clima',
      title: 'Condiciones actuales en Río Cuarto',
      body: `Temperatura actual: ${temp}°C · Humedad: ${humidity}% · Fuente: Open-Meteo`,
      source: 'Open-Meteo',
      source_url: 'https://open-meteo.com',
    }
  } catch {
    return null
  }
}

// ── NASA EONET: eventos naturales activos ─────────────────────────────────────
export async function fetchNASAEvents(): Promise<ExternalFact[]> {
  try {
    const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=5')
    if (!res.ok) return []
    const data = await res.json()
    return (data.events ?? []).slice(0, 3).map((ev: Record<string, unknown>) => ({
      category: 'desastres' as EnvCategory,
      title: `Evento natural activo: ${ev.title}`,
      body: `NASA registra este evento activo en el mundo. Estar informados nos ayuda a prepararnos mejor ante situaciones de emergencia.`,
      source: 'NASA EONET',
      source_url: String(ev.link ?? 'https://eonet.gsfc.nasa.gov'),
    }))
  } catch {
    return []
  }
}

// ── Contenido estático curado — reciclaje, agua, energía, etc. ────────────────
// Este contenido es base: siempre está disponible sin necesidad de API externa.
export const CURATED_FACTS: Omit<EnvContent, 'id' | 'active' | 'created_at'>[] = [
  // Reciclaje
  {
    category: 'reciclaje',
    title: '¿Sabías que el aluminio se recicla infinitas veces?',
    body: 'Reciclar una lata de aluminio ahorra suficiente energía para hacer funcionar un televisor durante 3 horas. Separar el aluminio marca la diferencia.',
    source: 'CONICET Divulgación',
  },
  {
    category: 'reciclaje',
    title: 'El papel tarda 5 años en degradarse',
    body: 'Reciclando 1 tonelada de papel se salvan 17 árboles y se ahorra 26.000 litros de agua. Siempre depositá el papel limpio y seco en el contenedor azul.',
    source: 'Secretaría de Ambiente',
  },
  {
    category: 'reciclaje',
    title: 'El plástico: un problema de siglos',
    body: 'Una botella plástica puede tardar hasta 500 años en degradarse. Reducir el uso de plástico de un solo uso es la acción más importante que podemos tomar hoy.',
    source: 'PNUMA',
  },
  // Agua
  {
    category: 'agua',
    title: 'Solo el 3% del agua del planeta es dulce',
    body: 'Y de ese porcentaje, solo el 0,3% es accesible para consumo humano. Cerrar la canilla mientras te cepillás los dientes ahorra hasta 12 litros.',
    source: 'UNESCO Agua',
  },
  {
    category: 'agua',
    title: 'Una pérdida de agua puede desperdiciar miles de litros',
    body: 'Un grifo con pérdida de 1 gota por segundo desperdicia 30 litros por día — más de 10.000 litros al año. Reportá y reparé las pérdidas.',
    source: 'AySA',
  },
  // Energía
  {
    category: 'energia',
    title: 'La energía solar ya es la más barata de la historia',
    body: 'El costo de la energía solar fotovoltaica cayó un 90% en la última década. Argentina tiene uno de los mejores recursos solares de Sudamérica.',
    source: 'IRENA 2023',
  },
  {
    category: 'energia',
    title: 'Apagar el standby puede ahorrar hasta el 10% de tu factura',
    body: 'Los aparatos en modo standby consumen energía continuamente. Desenchufar los que no usás es el gesto más simple para reducir tu consumo.',
    source: 'INTI Eficiencia Energética',
  },
  // Clima
  {
    category: 'clima',
    title: 'Los últimos 10 años fueron los más calurosos registrados',
    body: 'El calentamiento global ya supera 1,1°C respecto a la era preindustrial. Cada fracción de grado importa para preservar los ecosistemas y el agua.',
    source: 'WMO / OMM 2024',
  },
  {
    category: 'clima',
    title: 'La deforestación y el clima están conectados',
    body: 'Los bosques absorben CO₂ y regulan las lluvias. Perder un árbol es perder un aliado contra el cambio climático. Apoyá la forestación local.',
    source: 'IPCC 2023',
  },
  // Residuos
  {
    category: 'residuos',
    title: 'El compost transforma residuos en recurso',
    body: 'Hasta el 50% de lo que tiramos en casa es materia orgánica. Compostar reduce los residuos y genera abono natural para plantas y jardines.',
    source: 'Municipalidad de Río Cuarto',
  },
  {
    category: 'residuos',
    title: 'Las pilas contaminan el suelo y el agua',
    body: 'Una sola pila puede contaminar 600.000 litros de agua. Depositá las pilas usadas en los puntos de recolección autorizados — nunca en la basura común.',
    source: 'Secretaría de Ambiente',
  },
  // Contaminación
  {
    category: 'contaminacion',
    title: 'El aire que respiramos también se puede cuidar',
    body: 'Usar el transporte público, compartir viajes o ir en bicicleta reduce las emisiones de CO₂ y mejora la calidad del aire en la ciudad.',
    source: 'PNUMA',
  },
  {
    category: 'contaminacion',
    title: 'La contaminación lumínica afecta la biodiversidad',
    body: 'El exceso de iluminación artificial perturba los ciclos de animales, insectos y aves. Usar luces LED orientadas hacia abajo reduce este impacto.',
    source: 'IDA Dark Sky',
  },
  // Biodiversidad
  {
    category: 'biodiversidad',
    title: 'Río Cuarto y el monte nativo del sur de Córdoba',
    body: 'La región alberga especies únicas de flora y fauna autóctonas. Preservar los espacios verdes locales es cuidar la biodiversidad de nuestra región.',
    source: 'CONICET Córdoba',
  },
]

export async function fetchExternalFacts(
  enabledCategories: EnvCategory[]
): Promise<ExternalFact[]> {
  const results: ExternalFact[] = []

  const [weatherFact, nasaEvents] = await Promise.allSettled([
    fetchCurrentWeatherFact(),
    fetchNASAEvents(),
  ])

  if (weatherFact.status === 'fulfilled' && weatherFact.value) {
    if (enabledCategories.includes('clima')) {
      results.push(weatherFact.value)
    }
  }

  if (nasaEvents.status === 'fulfilled') {
    for (const ev of nasaEvents.value) {
      if (enabledCategories.includes(ev.category)) {
        results.push(ev)
      }
    }
  }

  return results
}
