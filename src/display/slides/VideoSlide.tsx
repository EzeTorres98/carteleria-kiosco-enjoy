import { useRef, useEffect } from 'react'

interface Props {
  data: { url: string; label?: string }
  onEnded: () => void
}

export default function VideoSlide({ data, onEnded }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.play().catch(() => {})
  }, [data.url])

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <video
        ref={ref}
        src={data.url}
        className="w-full h-full object-cover"
        playsInline
        muted
        onEnded={onEnded}
      />
    </div>
  )
}
