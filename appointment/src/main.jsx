import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from './context/AppContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

// 👇 Add your real Google Client ID here
const clientId = '399526421214-d77mi83qmjd4drv8fg7en6gokuuc0itr.apps.googleusercontent.com';

// 👇 Apply dark mode class
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AppContextProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AppContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
