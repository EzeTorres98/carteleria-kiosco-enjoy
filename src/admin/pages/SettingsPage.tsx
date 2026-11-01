import { ExternalLink, Monitor } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Configuración</h1>

      <div className="flex flex-col gap-6 max-w-lg">
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Monitor size={18} />
            Pantalla display
          </h2>
          <div className="flex flex-col gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#e63946] hover:underline"
            >
              <ExternalLink size={14} />
              Abrir display en pantalla completa
            </a>
            <p className="text-zinc-500 text-sm">
              Formato 9:16 vertical — ideal para pantallas de caja
            </p>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Ubicación SMN</h2>
          <div className="flex flex-col gap-2">
            <p className="text-zinc-300 text-sm">
              <span className="text-zinc-500">Ciudad:</span> Río Cuarto
            </p>
            <p className="text-zinc-300 text-sm">
              <span className="text-zinc-500">Provincia:</span> Córdoba
            </p>
            <p className="text-zinc-300 text-sm">
              <span className="text-zinc-500">CP:</span> 5800
            </p>
            <p className="text-zinc-300 text-sm">
              <span className="text-zinc-500">Estación SMN:</span> 87532
            </p>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-3">Versión</h2>
          <p className="text-zinc-500 text-sm">Cartelería Digital v2.0 — Kiosco Enjoy</p>
          <p className="text-zinc-600 text-xs mt-1">React 18 · TypeScript · Tailwind · Supabase</p>
        </section>
      </div>
    </div>
  )
}
