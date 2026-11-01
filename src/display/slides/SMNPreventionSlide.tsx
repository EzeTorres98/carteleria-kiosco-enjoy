import { motion } from 'framer-motion'
import { ShieldCheck, Smartphone } from 'lucide-react'
import { SMN_ALERT_COLORS, getPreventionMeasures } from '@/lib/smn'
import type { SMNAlert, SMNAlertLevel } from '@/types'

interface Props {
  data: unknown
}

const LEVEL_BG: Record<SMNAlertLevel, string> = {
  amarillo: 'bg-yellow-900',
  naranja: 'bg-orange-950',
  rojo: 'bg-red-950',
}

export default function SMNPreventionSlide({ data }: Props) {
  const alert = data as SMNAlert
  const colors = SMN_ALERT_COLORS[alert.level]
  const measures = getPreventionMeasures(alert.phenomenon)
  const bgDark = LEVEL_BG[alert.level]

  return (
    <div
      className={`w-full h-full flex flex-col ${bgDark} relative overflow-hidden`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {/* Header con nivel */}
      <div className={`${colors.bg} px-8 pt-10 pb-6`}>
        <p className={`${colors.text} font-black text-sm tracking-[0.3em]`}>
          SERVICIO METEOROLÓGICO NACIONAL
        </p>
        <p className={`${colors.text} font-bold text-3xl mt-1`}>
          ¿Qué hacer ante una {alert.phenomenon}?
        </p>
      </div>

      {/* Medidas */}
      <div className="flex-1 flex flex-col justify-center gap-4 px-8 py-6">
        {measures.map((measure, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-4"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.12 }}
          >
            <ShieldCheck size={22} className={`${colors.bg.replace('bg-', 'text-')} shrink-0 mt-0.5`} />
            <p className="text-white text-xl leading-snug">{measure}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA app SMN */}
      <motion.div
        className={`relative z-10 mx-8 mb-10 rounded-2xl ${colors.bg} p-5 flex items-center gap-4`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Smartphone size={36} className={colors.text} />
        <div>
          <p className={`${colors.text} font-bold text-lg leading-tight`}>
            Descargá la app del SMN
          </p>
          <p className={`${colors.text} text-base opacity-80`}>
            Recibí alertas en tu celular en tiempo real
          </p>
        </div>
      </motion.div>
    </div>
  )
}
