import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import {
  LayoutGrid, ImageIcon, Package, CloudLightning, Leaf, Settings
} from 'lucide-react'
import PlaylistPage from './pages/PlaylistPage'
import MediaPage from './pages/MediaPage'
import ProductsPage from './pages/ProductsPage'
import SMNConfigPage from './pages/SMNConfigPage'
import EnvContentPage from './pages/EnvContentPage'
import SettingsPage from './pages/SettingsPage'

const NAV = [
  { to: 'playlist',    icon: LayoutGrid,      label: 'Playlist' },
  { to: 'media',       icon: ImageIcon,        label: 'Medios' },
  { to: 'products',    icon: Package,          label: 'Productos' },
  { to: 'smn',         icon: CloudLightning,   label: 'SMN' },
  { to: 'ambiente',    icon: Leaf,             label: 'Ambiente' },
  { to: 'settings',    icon: Settings,         label: 'Config' },
]

export default function AdminApp() {
  return (
    <div className="w-full h-full flex bg-zinc-950 text-white overflow-hidden" style={{ fontFamily: 'var(--font-display)' }}>
      {/* Sidebar */}
      <aside className="w-20 flex flex-col items-center py-6 gap-2 bg-zinc-900 border-r border-zinc-800 shrink-0">
        {/* Logo */}
        <div className="mb-4 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#e63946] flex items-center justify-center font-black text-white text-lg">
            K
          </div>
        </div>

        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 px-2 rounded-xl w-full transition-colors ${
                isActive
                  ? 'bg-[#e63946]/20 text-[#e63946]'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-[10px] font-semibold tracking-wide">{label}</span>
          </NavLink>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="playlist" replace />} />
          <Route path="playlist"  element={<PlaylistPage />} />
          <Route path="media"     element={<MediaPage />} />
          <Route path="products"  element={<ProductsPage />} />
          <Route path="smn"       element={<SMNConfigPage />} />
          <Route path="ambiente"  element={<EnvContentPage />} />
          <Route path="settings"  element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}
