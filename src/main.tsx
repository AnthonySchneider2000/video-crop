import React from 'react'
import ReactDOM from 'react-dom/client'
import HomePage from './pages/HomePage.tsx'
import './index.css'
import { FileProvider } from './lib/FileContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FileProvider>
      <HomePage />
    </FileProvider>
  </React.StrictMode>,
)
