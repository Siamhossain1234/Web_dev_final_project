import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ClerkProvider} from '@clerk/clerk-react'

// Import your Publishable Key
const vitekey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log(vitekey)

if (!vitekey) {
  throw new Error("Missing Publishable Key")
}

const rootElement = document.getElementById('root');


if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={vitekey} afterSignOutUrl="/login">
      <App />
      </ClerkProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}