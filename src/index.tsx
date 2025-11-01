import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/common/ErrorBoundary'
import './index.css'
import reportWebVitals from './reportWebVitals'

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        )
        registration.update()
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error)
      })
  })
}

// --- React App Mounting ---
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    "Could not find root element with id 'root' to mount the application to."
  )
}

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

// --- Performance Monitoring ---
reportWebVitals()
