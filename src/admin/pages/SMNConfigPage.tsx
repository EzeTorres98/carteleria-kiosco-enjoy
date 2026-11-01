import { useQuery } from '@tanstack/react-query'
import { fetchSMNData, SMN_ALERT_COLORS } from '@/lib/smn'
import { CloudLightning, RefreshCw, Smartphone, AlertTriangle } from 'lucide-react'
import type { SMNAlertLevel } from '@/types'

const LEVEL_LABELS: Record<SMNAlertLevel, string> = {
  amarillo: 'Alerta Amarilla',
  naranja: 'Alerta Naranja',
  rojo: 'Alerta Roja',
}

export default function SMNConfigPage() {
  const { data: smn, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['smn-admin'],
    queryFn: fetchSMNData,
    staleTime: 1000 * 60 * 15,
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Alertas SMN</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Servicio Meteorológico Nacional — Río Cuarto, Córdoba
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-center py-20">Consultando API SMN...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Estado alertas */}
          <section>
            <h2 className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-3">
              Alertas activas para Río Cuarto
            </h2>
            {!smn?.alerts.length ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center gap-3 text-zinc-400">
                <CloudLightning size={24} />
                <p>No hay alertas activas en este momento</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {smn.alerts.map(alert => {
                  const colors = SMN_ALERT_COLORS[alert.level]
                  return (
                    <div
                      key={alert.id}
                      className={`rounded-xl p-5 ${colors.bg} flex items-start gap-4`}
                    >
                      <AlertTriangle size={24} className={colors.text} />
                      <div>
                        <p className={`${colors.text} font-bold text-lg`}>
                          {LEVEL_LABELS[alert.level]} — {alert.phenomenon}
                        </p>
                        <p className={`${colors.text} text-sm mt-1 opacity-80`}>
                          {alert.description}
                        </p>
                        <p className={`${colors.text} text-xs mt-2 opacity-60`}>
                          Hasta: {new Date(alert.valid_to).toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Cómo funciona */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Smartphone size={18} />
              ¿Cómo funciona en pantalla?
            </h2>
            <ul className="text-zinc-400 text-sm flex flex-col gap-2">
              <li>• Cuando hay una alerta activa, aparece automáticamente en la playlist</li>
              <li>• Se muestran dos slides: la alerta y las medidas de prevención</li>
              <li>• Si no hay alertas, estas slides no aparecen</li>
              <li>• Los datos se actualizan cada 15 minutos automáticamente</li>
              <li>• El diseño respeta los colores oficiales del SMN (amarillo / naranja / rojo)</li>
            </ul>
          </section>

          {smn?.fetched_at && (
            <p className="text-zinc-600 text-xs">
              Última consulta: {new Date(smn.fetched_at).toLocaleString('es-AR')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
