import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, getActiveSlides } from '@/lib/supabase'
import { GripVertical, Eye, EyeOff, Trash2, Plus } from 'lucide-react'
import type { Slide } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  video: '🎬 Video',
  image: '🖼️ Imagen',
  product: '🏷️ Producto',
  smn_alert: '⚠️ Alerta SMN',
  smn_prevention: '🛡️ Prevención SMN',
  env_content: '🌿 Ambiente',
}

export default function PlaylistPage() {
  const qc = useQueryClient()
  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['slides'],
    queryFn: getActiveSlides,
  })

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('slides')
        .update({ active })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['slides'] }),
  })

  const deleteSlide = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('slides').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['slides'] }),
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Playlist</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {slides.length} slide{slides.length !== 1 ? 's' : ''} activa{slides.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#e63946] hover:bg-[#b71c2a] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
          <Plus size={16} />
          Agregar slide
        </button>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-center py-20">Cargando...</div>
      ) : slides.length === 0 ? (
        <div className="text-zinc-500 text-center py-20">
          <p className="text-xl mb-2">No hay slides configuradas</p>
          <p className="text-sm">Agregá videos, imágenes o productos para empezar</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {(slides as Slide[]).map((slide) => (
            <div
              key={slide.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                slide.active
                  ? 'bg-zinc-900 border-zinc-800'
                  : 'bg-zinc-950 border-zinc-900 opacity-50'
              }`}
            >
              <GripVertical size={18} className="text-zinc-600 cursor-grab shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">
                    {TYPE_LABELS[slide.type] ?? slide.type}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {slide.duration}s · orden #{slide.order}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive.mutate({ id: slide.id, active: !slide.active })}
                  className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  {slide.active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar esta slide?')) deleteSlide.mutate(slide.id)
                  }}
                  className="p-2 rounded-lg hover:bg-red-950 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
