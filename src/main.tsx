import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

import DisplayApp from '@/display/DisplayApp'
import AdminApp from '@/admin/AdminApp'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 2,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<DisplayApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
