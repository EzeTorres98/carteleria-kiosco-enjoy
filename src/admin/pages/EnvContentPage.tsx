import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getActiveEnvContent, getEnvSources, supabase } from '@/lib/supabase'
import { CURATED_FACTS } from '@/lib/env-api'
import { Plus, Eye, EyeOff, Globe, Database, Leaf } from 'lucide-react'
import type { EnvContent, EnvSource, EnvCategory } from '@/types'

const CATEGORY_LABELS: Record<EnvCategory, string> = {
  clima: '🌍 Clima',
  reciclaje: '♻️ Reciclaje',
  agua: '💧 Agua',
  energia: '⚡ Energía',
  residuos: '🗑️ Residuos',
  contaminacion: '💨 Contaminación',
  desastres: '⚠️ Desastres',
  biodiversidad: '🌿 Biodiversidad',
}

export default function EnvContentPage() {
  const qc = useQueryClient()

  const { data: myContent = [] } = useQuery({
    queryKey: ['env-content-all'],
    queryFn: getActiveEnvContent,
  })

  const { data: sources = [] } = useQuery({
    queryKey: ['env-sources'],
    queryFn: getEnvSources,
  })

  const toggleSource = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('env_sources')
        .update({ enabled })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['env-sources'] }),
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Contenido Ambiental</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Concientización — reciclaje, clima, agua, energía y más
          </p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
          <Plus size={16} />
          Agregar tip
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Fuentes externas */}
        <section>
          <h2 className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
            <Globe size={13} /> Fuentes externas automáticas
          </h2>
          <div className="flex flex-col gap-2">
            {(sources as EnvSource[]).map(src => (
              <div
                key={src.id}
                className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
              >
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{src.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {CATEGORY_LABELS[src.category as EnvCategory] ?? src.category}
                  </p>
                </div>
                <button
                  onClick={() => toggleSource.mutate({ id: src.id, enabled: !src.enabled })}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    src.enabled
                      ? 'bg-emerald-900 text-emerald-400 hover:bg-emerald-800'
                      : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                  }`}
                >
                  {src.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                  {src.enabled ? 'Activa' : 'Inactiva'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Contenido curado */}
        <section>
          <h2 className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
            <Database size={13} /> Base de datos curada ({CURATED_FACTS.length} tips)
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CURATED_FACTS.map((fact, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
              >
                <p className="text-xs text-emerald-500 font-semibold mb-1">
                  {CATEGORY_LABELS[fact.category]}
                </p>
                <p className="text-white text-sm font-medium leading-snug">{fact.title}</p>
                <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{fact.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contenido propio */}
        {(myContent as EnvContent[]).length > 0 && (
          <section>
            <h2 className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
              <Leaf size={13} /> Mis tips personalizados
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(myContent as EnvContent[]).map(item => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                >
                  <p className="text-xs text-emerald-500 font-semibold mb-1">
                    {CATEGORY_LABELS[item.category]}
                  </p>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{item.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
