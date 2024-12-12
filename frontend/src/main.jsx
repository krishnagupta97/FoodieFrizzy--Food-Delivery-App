import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import { ToastContainer } from 'react-toastify'
import { Auth0Provider } from "@auth0/auth0-react"

createRoot(document.getElementById('root')).render(
  <Router>
    <StoreContextProvider>
      <Auth0Provider
        domain="dev-xm2s4uw3plhh1ycq.us.auth0.com"
        clientId="DyqPO0euNBlp2L3VCS4jgT73nz4SsFJa"
        authorizationParams={{
          redirect_uri: window.location.origin
        }}>
        <App />
      </Auth0Provider>
      <ToastContainer />
    </StoreContextProvider>
  </Router>
)
