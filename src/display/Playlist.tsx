import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Slide, SMNData, EnvContent } from '@/types'
import VideoSlide from './slides/VideoSlide'
import ImageSlide from './slides/ImageSlide'
import ProductSlide from './slides/ProductSlide'
import SMNAlertSlide from './slides/SMNAlertSlide'
import SMNPreventionSlide from './slides/SMNPreventionSlide'
import EnvContentSlide from './slides/EnvContentSlide'

interface Props {
  slides: Slide[]
  smnData?: SMNData
  envContent: EnvContent[]
  settings?: { default_slide_duration: number } | null
}

// Construye la playlist efectiva mezclando slides configuradas,
// alertas SMN activas y contenido ambiental
function buildEffectivePlaylist(
  slides: Slide[],
  smnData: SMNData | undefined,
  envContent: EnvContent[],
  defaultDuration: number
): Array<{ id: string; type: string; duration: number; data: unknown }> {
  const list: Array<{ id: string; type: string; duration: number; data: unknown }> = []

  // Slides configuradas por el admin
  for (const slide of slides) {
    list.push({
      id: slide.id,
      type: slide.type,
      duration: slide.duration || defaultDuration,
      data: slide.payload,
    })
  }

  // Alertas SMN activas — se insertan automáticamente
  if (smnData?.alerts.length) {
    for (const alert of smnData.alerts) {
      list.push({
        id: `smn-alert-${alert.id}`,
        type: 'smn_alert',
        duration: 15,
        data: alert,
      })
      list.push({
        id: `smn-prev-${alert.id}`,
        type: 'smn_prevention',
        duration: 12,
        data: alert,
      })
    }
  }

  // Contenido ambiental — rotar de a uno cada N slides
  if (envContent.length > 0) {
    const baseCount = Math.max(slides.length, 1)
    const everyN = Math.max(Math.floor(baseCount / 2), 1)
    const shuffled = [...envContent].sort(() => Math.random() - 0.5)
    let envIdx = 0
    const withEnv: typeof list = []
    for (let i = 0; i < list.length; i++) {
      withEnv.push(list[i])
      if ((i + 1) % everyN === 0 && envIdx < shuffled.length) {
        withEnv.push({
          id: `env-${shuffled[envIdx].id}`,
          type: 'env_content',
          duration: 12,
          data: shuffled[envIdx],
        })
        envIdx++
      }
    }
    // Si no hubo slides de admin, igual mostramos el env content
    if (slides.length === 0) {
      for (const ec of shuffled) {
        withEnv.push({ id: `env-${ec.id}`, type: 'env_content', duration: 12, data: ec })
      }
    }
    return withEnv
  }

  return list
}

const SLIDE_TRANSITION = {
  initial: { opacity: 0, scale: 1.03 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
}

export default function Playlist({ slides, smnData, envContent, settings }: Props) {
  const defaultDuration = settings?.default_slide_duration ?? 10
  const [current, setCurrent] = useState(0)

  const playlist = buildEffectivePlaylist(slides, smnData, envContent, defaultDuration)

  const advance = useCallback(() => {
    setCurrent(prev => (prev + 1) % Math.max(playlist.length, 1))
  }, [playlist.length])

  const currentItem = playlist[current]

  useEffect(() => {
    if (!currentItem) return
    const timer = setTimeout(advance, currentItem.duration * 1000)
    return () => clearTimeout(timer)
  }, [current, currentItem, advance])

  if (!currentItem) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-white/30 text-2xl font-light tracking-widest">KIOSCO ENJOY</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          className="absolute inset-0"
          {...SLIDE_TRANSITION}
        >
          {currentItem.type === 'video' && (
            <VideoSlide data={currentItem.data as { url: string; label?: string }} onEnded={advance} />
          )}
          {currentItem.type === 'image' && (
            <ImageSlide data={currentItem.data as { url: string; label?: string }} />
          )}
          {currentItem.type === 'product' && (
            <ProductSlide data={currentItem.data as { product_id: string }} />
          )}
          {currentItem.type === 'smn_alert' && (
            <SMNAlertSlide data={currentItem.data} />
          )}
          {currentItem.type === 'smn_prevention' && (
            <SMNPreventionSlide data={currentItem.data} />
          )}
          {currentItem.type === 'env_content' && (
            <EnvContentSlide data={currentItem.data as EnvContent} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
