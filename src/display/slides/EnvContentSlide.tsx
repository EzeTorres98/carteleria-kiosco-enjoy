import { motion } from 'framer-motion'
import {
  Recycle, Droplets, Zap, Wind, Trash2,
  TreePine, Globe, AlertTriangle, Leaf
} from 'lucide-react'
import type { EnvContent, EnvCategory } from '@/types'

interface Props {
  data: EnvContent
}

const CATEGORY_CONFIG: Record<
  EnvCategory,
  { icon: React.FC<{ size?: number; className?: string }>; label: string; gradient: string; accent: string }
> = {
  clima: {
    icon: Globe,
    label: 'CAMBIO CLIMÁTICO',
    gradient: 'from-sky-950 via-blue-900 to-sky-950',
    accent: 'text-sky-400',
  },
  reciclaje: {
    icon: Recycle,
    label: 'RECICLAJE',
    gradient: 'from-green-950 via-emerald-900 to-green-950',
    accent: 'text-emerald-400',
  },
  agua: {
    icon: Droplets,
    label: 'CUIDADO DEL AGUA',
    gradient: 'from-cyan-950 via-cyan-900 to-blue-950',
    accent: 'text-cyan-400',
  },
  energia: {
    icon: Zap,
    label: 'ENERGÍA',
    gradient: 'from-amber-950 via-yellow-900 to-amber-950',
    accent: 'text-yellow-400',
  },
  residuos: {
    icon: Trash2,
    label: 'GESTIÓN DE RESIDUOS',
    gradient: 'from-teal-950 via-teal-900 to-teal-950',
    accent: 'text-teal-400',
  },
  contaminacion: {
    icon: Wind,
    label: 'CONTAMINACIÓN',
    gradient: 'from-purple-950 via-purple-900 to-purple-950',
    accent: 'text-purple-400',
  },
  desastres: {
    icon: AlertTriangle,
    label: 'DESASTRES NATURALES',
    gradient: 'from-orange-950 via-orange-900 to-red-950',
    accent: 'text-orange-400',
  },
  biodiversidad: {
    icon: TreePine,
    label: 'BIODIVERSIDAD',
    gradient: 'from-lime-950 via-green-900 to-lime-950',
    accent: 'text-lime-400',
  },
}

export default function EnvContentSlide({ data }: Props) {
  const cfg = CATEGORY_CONFIG[data.category] ?? CATEGORY_CONFIG.clima
  const Icon = cfg.icon

  return (
    <div
      className={`w-full h-full flex flex-col bg-gradient-to-b ${cfg.gradient} relative overflow-hidden`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {/* Glow de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-20 ${cfg.accent.replace('text-', 'bg-')}`} />
      </div>

      {/* Categoría header */}
      <div className="relative z-10 flex items-center gap-3 px-8 pt-12">
        <div className={`${cfg.accent} opacity-60 text-xs font-bold tracking-[0.35em]`}>
          {cfg.label}
        </div>
      </div>

      {/* Icono central */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 px-8">
        <motion.div
          initial={{ scale: 0, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        >
          <Icon size={96} className={`${cfg.accent} drop-shadow-lg`} />
        </motion.div>

        <motion.h2
          className="text-white font-bold text-3xl text-center leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {data.title}
        </motion.h2>

        <motion.p
          className="text-white/80 text-xl text-center leading-relaxed font-light"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {data.body}
        </motion.p>
      </div>

      {/* Fuente / leaf decoration */}
      <div className="relative z-10 flex items-center justify-between px-8 pb-10">
        {data.source && (
          <p className="text-white/40 text-base">
            Fuente: {data.source}
          </p>
        )}
        <Leaf size={20} className={`${cfg.accent} opacity-40 ml-auto`} />
      </div>
    </div>
  )
}
