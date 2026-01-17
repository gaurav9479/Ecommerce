import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import { UserProvider } from './Context/User.Context.jsx'
import { WishlistProvider } from './Context/WishlistContext.jsx'
import { CartProvider } from './Context/CartContext.jsx'
import { ThemeProvider } from './Context/ThemeContext.jsx'
import { Toaster } from 'react-hot-toast'





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <UserProvider>
            <ThemeProvider>
              <App />
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </UserProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
      

  </StrictMode>,
)
