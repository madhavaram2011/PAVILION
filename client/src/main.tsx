import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#4e3921',
              color: '#faf7f2',
              fontFamily: 'Josefin Sans, sans-serif',
              fontSize: '14px',
              letterSpacing: '0.05em',
              borderRadius: '12px',
            },
            success: {
              iconTheme: { primary: '#5a9f5a', secondary: '#faf7f2' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#faf7f2' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)