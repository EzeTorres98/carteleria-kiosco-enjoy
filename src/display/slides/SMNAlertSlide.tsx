import { motion } from 'framer-motion'
import { AlertTriangle, Wind, CloudRain, Thermometer, Zap } from 'lucide-react'
import { SMN_ALERT_COLORS } from '@/lib/smn'
import type { SMNAlert, SMNAlertLevel } from '@/types'

interface Props {
  data: unknown
}

const LEVEL_LABELS: Record<SMNAlertLevel, string> = {
  amarillo: 'ALERTA AMARILLA',
  naranja: 'ALERTA NARANJA',
  rojo: 'ALERTA ROJA',
}

const PHENOMENON_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  tormenta: Zap,
  viento: Wind,
  lluvia: CloudRain,
  calor: Thermometer,
  frio: Thermometer,
}

function getPhenomenonIcon(phenomenon: string) {
  const key = Object.keys(PHENOMENON_ICONS).find(k =>
    phenomenon.toLowerCase().includes(k)
  )
  return PHENOMENON_ICONS[key ?? ''] ?? AlertTriangle
}

export default function SMNAlertSlide({ data }: Props) {
  const alert = data as SMNAlert
  const colors = SMN_ALERT_COLORS[alert.level]
  const Icon = getPhenomenonIcon(alert.phenomenon)

  return (
    <div
      className={`w-full h-full flex flex-col ${colors.bg} relative overflow-hidden`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {/* Patrón de fondo diagonal */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(0,0,0,0.3) 20px,
            rgba(0,0,0,0.3) 22px
          )`,
        }}
      />

      {/* Logo SMN */}
      <div className="relative z-10 flex items-center gap-3 px-8 pt-10">
        <div className={`${colors.text} font-black text-sm tracking-[0.3em] opacity-80`}>
          SERVICIO METEOROLÓGICO NACIONAL
        </div>
      </div>

      {/* Icono y nivel */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        >
          <Icon size={120} className={`${colors.text} drop-shadow-lg`} />
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className={`${colors.text} font-black text-4xl tracking-widest text-center`}>
            {LEVEL_LABELS[alert.level]}
          </p>
          <p className={`${colors.text} font-bold text-2xl text-center uppercase tracking-wide`}>
            {alert.phenomenon}
          </p>
        </motion.div>

        <motion.p
          className={`${colors.text} text-xl text-center font-light leading-relaxed max-w-xs`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {alert.description}
        </motion.p>
      </div>

      {/* Vigencia */}
      {(alert.valid_from || alert.valid_to) && (
        <div className={`relative z-10 ${colors.text} text-center text-lg font-medium pb-10 opacity-80`}>
          Vigente hasta: {new Date(alert.valid_to).toLocaleString('es-AR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
          })} hs
        </div>
      )}
    </div>
  )
}
