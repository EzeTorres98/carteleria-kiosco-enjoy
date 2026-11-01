import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Slides ─────────────────────────────────────────────────────────────────────

export async function getActiveSlides() {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .eq('active', true)
    .order('order', { ascending: true })
  if (error) throw error
  return data
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ── Media ─────────────────────────────────────────────────────────────────────

export async function getAllMedia() {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ── Env Content ───────────────────────────────────────────────────────────────

export async function getActiveEnvContent() {
  const { data, error } = await supabase
    .from('env_content')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getEnvSources() {
  const { data, error } = await supabase
    .from('env_sources')
    .select('*')
  if (error) throw error
  return data
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()
  if (error) throw error
  return data
}
