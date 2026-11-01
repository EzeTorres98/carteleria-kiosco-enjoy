import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

interface Props {
  data: { product_id: string }
}

async function fetchProduct(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function ProductSlide({ data }: Props) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', data.product_id],
    queryFn: () => fetchProduct(data.product_id),
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading || !product) {
    return <div className="w-full h-full bg-black" />
  }

  return (
    <div
      className="w-full h-full flex flex-col bg-black relative overflow-hidden"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {/* Fondo con glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-[#e63946]/20 pointer-events-none" />

      {/* Imagen del producto */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-8 pt-12">
        <motion.img
          src={product.photo_url}
          alt={product.name}
          className="max-h-[55vh] max-w-full object-contain drop-shadow-2xl"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Info precio */}
      <div className="relative z-10 px-8 pb-16 flex flex-col items-center gap-2">
        <motion.p
          className="text-white/70 text-2xl font-light tracking-wide text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {product.name}
        </motion.p>

        {product.original_price && (
          <motion.p
            className="text-white/40 text-3xl line-through"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {formatPrice(product.original_price)}
          </motion.p>
        )}

        <motion.p
          className="text-[#e63946] font-black text-7xl leading-none tracking-tight"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 18 }}
        >
          {formatPrice(product.price)}
        </motion.p>

        <motion.div
          className="mt-2 bg-[#e63946] text-white font-bold text-xl px-8 py-2 rounded-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          OFERTA
        </motion.div>
      </div>
    </div>
  )
}
