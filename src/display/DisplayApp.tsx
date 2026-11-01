import { useQuery } from '@tanstack/react-query'
import { getActiveSlides, getSettings } from '@/lib/supabase'
import { fetchSMNData } from '@/lib/smn'
import { fetchExternalFacts, CURATED_FACTS } from '@/lib/env-api'
import Playlist from './Playlist'
import type { Slide, SMNData, EnvContent, EnvCategory } from '@/types'

export default function DisplayApp() {
  const { data: slides = [] } = useQuery({
    queryKey: ['slides'],
    queryFn: getActiveSlides,
    refetchInterval: 1000 * 60 * 2, // refresca cada 2 min
  })

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 1000 * 60 * 10,
  })

  const { data: smnData } = useQuery<SMNData>({
    queryKey: ['smn'],
    queryFn: fetchSMNData,
    refetchInterval: 1000 * 60 * 15, // refresca cada 15 min
    enabled: settings?.smn_enabled !== false,
  })

  const { data: externalFacts = [] } = useQuery({
    queryKey: ['env-external', settings?.env_categories],
    queryFn: () =>
      fetchExternalFacts((settings?.env_categories ?? []) as EnvCategory[]),
    refetchInterval: 1000 * 60 * 60, // refresca cada hora
    enabled: settings?.env_content_enabled !== false,
  })

  // Contenido ambiental curado como fallback siempre disponible
  const curatedEnvContent: EnvContent[] = CURATED_FACTS
    .filter(f =>
      (settings?.env_categories ?? [
        'clima','reciclaje','agua','energia',
        'residuos','contaminacion','desastres','biodiversidad',
      ]).includes(f.category)
    )
    .map((f, i) => ({
      ...f,
      id: `curated-${i}`,
      active: true,
      created_at: '',
    }))

  const externalEnvContent: EnvContent[] = externalFacts.map((f, i) => ({
    ...f,
    id: `ext-${i}`,
    active: true,
    created_at: '',
  }))

  const allEnvContent = [...externalEnvContent, ...curatedEnvContent]

  return (
    <div className="w-full h-full bg-black overflow-hidden">
      <Playlist
        slides={slides as Slide[]}
        smnData={smnData}
        envContent={allEnvContent}
        settings={settings}
      />
    </div>
  )
}
