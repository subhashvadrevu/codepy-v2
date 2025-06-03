import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import "@fontsource/outfit"; // Defaults to weight 400
import "@fontsource/outfit/400.css"; // Specify weight
// import "@fontsource/outfit/400-italic.css"; // Specify weight and style

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
