// ── Slide types ────────────────────────────────────────────────────────────────

export type SlideType =
  | 'video'
  | 'image'
  | 'product'
  | 'smn_alert'
  | 'smn_prevention'
  | 'env_content'

export interface Slide {
  id: string
  type: SlideType
  duration: number        // segundos
  order: number
  active: boolean
  // payload específico según tipo
  payload: SlidePayload
  created_at: string
}

export type SlidePayload =
  | VideoPayload
  | ImagePayload
  | ProductPayload
  | SMNAlertPayload
  | SMNPreventionPayload
  | EnvContentPayload

export interface VideoPayload {
  url: string
  label?: string
}

export interface ImagePayload {
  url: string
  label?: string
}

export interface ProductPayload {
  product_id: string
}

export interface SMNAlertPayload {
  // se genera automáticamente desde la API SMN
}

export interface SMNPreventionPayload {
  alert_level: SMNAlertLevel
  category: string
}

export interface EnvContentPayload {
  content_id?: string   // si viene de la base propia
  source?: string       // si viene de API externa
}

// ── Products ────────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  photo_url: string
  price: number
  original_price?: number
  active: boolean
  created_at: string
}

// ── Media ───────────────────────────────────────────────────────────────────────

export type MediaType = 'video' | 'image'

export interface Media {
  id: string
  type: MediaType
  url: string
  label: string
  file_size: number
  created_at: string
}

// ── SMN ─────────────────────────────────────────────────────────────────────────

export type SMNAlertLevel = 'amarillo' | 'naranja' | 'rojo'

export interface SMNAlert {
  id: string
  level: SMNAlertLevel
  phenomenon: string      // viento, lluvia, tormenta, etc.
  description: string
  valid_from: string
  valid_to: string
  zone: string
}

export interface SMNForecast {
  date: string
  temp_max: number
  temp_min: number
  description: string
  icon: string
}

export interface SMNData {
  alerts: SMNAlert[]
  forecasts: SMNForecast[]
  fetched_at: string
}

// ── Environmental content ────────────────────────────────────────────────────────

export type EnvCategory =
  | 'clima'
  | 'reciclaje'
  | 'agua'
  | 'energia'
  | 'residuos'
  | 'contaminacion'
  | 'desastres'
  | 'biodiversidad'

export interface EnvContent {
  id: string
  category: EnvCategory
  title: string
  body: string
  image_url?: string
  source?: string
  source_url?: string
  active: boolean
  created_at: string
}

export interface EnvSource {
  id: string
  name: string
  category: EnvCategory
  api_url: string
  enabled: boolean
}

// ── Settings ─────────────────────────────────────────────────────────────────────

export interface Settings {
  id: string
  smn_zone_id: string
  smn_enabled: boolean
  env_content_enabled: boolean
  env_categories: EnvCategory[]
  default_slide_duration: number
}
