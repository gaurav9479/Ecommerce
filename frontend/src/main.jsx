import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import { UserProvider } from './Context/User.Context.jsx'
import { Toaster } from 'react-hot-toast'





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
      <App/>
      <Toaster position="top-center" reverseOrder={false} />
      </UserProvider>
    </AuthProvider>
      

  </StrictMode>,
)
