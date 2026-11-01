import { useQuery } from '@tanstack/react-query'
import { getAllMedia } from '@/lib/supabase'
import { Upload, Film, ImageIcon } from 'lucide-react'
import type { Media } from '@/types'

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaPage() {
  const { data: media = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: getAllMedia,
  })

  const videos = (media as Media[]).filter(m => m.type === 'video')
  const images = (media as Media[]).filter(m => m.type === 'image')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Medios</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {videos.length} video{videos.length !== 1 ? 's' : ''} · {images.length} imagen{images.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#e63946] hover:bg-[#b71c2a] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
          <Upload size={16} />
          Subir archivo
        </button>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-center py-20">Cargando...</div>
      ) : media.length === 0 ? (
        <div className="text-zinc-500 text-center py-20">
          <Upload size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-xl mb-2">No hay medios subidos</p>
          <p className="text-sm">Subí videos MP4 e imágenes para la pantalla</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {videos.length > 0 && (
            <section>
              <h2 className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                <Film size={14} /> Videos
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {videos.map(v => (
                  <div key={v.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
                    <Film size={28} className="text-zinc-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{v.label || 'Sin nombre'}</p>
                      <p className="text-zinc-500 text-xs">{formatSize(v.file_size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {images.length > 0 && (
            <section>
              <h2 className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                <ImageIcon size={14} /> Imágenes
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {images.map(img => (
                  <div key={img.id} className="relative rounded-xl overflow-hidden aspect-[9/16] bg-zinc-900 border border-zinc-800">
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                      <p className="text-white text-xs truncate">{img.label || 'Sin nombre'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
