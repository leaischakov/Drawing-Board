import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HompePage from './components/homePage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  {/* <HompePage></HompePage> */}
  </StrictMode>,
)
