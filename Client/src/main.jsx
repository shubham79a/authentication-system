import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ShopContextProvoder } from './Context/ShopContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvoder>
      <App />
    </ShopContextProvoder>
  </BrowserRouter>,
)
