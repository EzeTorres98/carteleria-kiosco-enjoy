import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllProducts } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import type { Product } from '@/types'

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n)
}

export default function ProductsPage() {
  const qc = useQueryClient()
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-all'],
    queryFn: getAllProducts,
  })

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from('products').update({ active }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products-all'] }),
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos en oferta</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {(products as Product[]).filter(p => p.active).length} activos
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#e63946] hover:bg-[#b71c2a] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
          <Plus size={16} />
          Nuevo producto
        </button>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-center py-20">Cargando...</div>
      ) : products.length === 0 ? (
        <div className="text-zinc-500 text-center py-20">
          <p className="text-xl mb-2">No hay productos cargados</p>
          <p className="text-sm">Agregá productos con foto y precio para mostrar en la pantalla</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {(products as Product[]).map(product => (
            <div
              key={product.id}
              className={`bg-zinc-900 border rounded-xl overflow-hidden transition-opacity ${
                product.active ? 'border-zinc-800' : 'border-zinc-900 opacity-50'
              }`}
            >
              <div className="aspect-square bg-zinc-800 relative">
                <img
                  src={product.photo_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-4">
                <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-[#e63946] font-black text-xl">{formatPrice(product.price)}</p>
                  {product.original_price && (
                    <p className="text-zinc-500 text-sm line-through">{formatPrice(product.original_price)}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                    <Pencil size={12} /> Editar
                  </button>
                  <button
                    onClick={() => toggleActive.mutate({ id: product.id, active: !product.active })}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                  >
                    {product.active ? <EyeOff size={12} /> : <Eye size={12} />}
                    {product.active ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
