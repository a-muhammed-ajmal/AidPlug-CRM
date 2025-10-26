import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals'; // Import the web vitals function

// --- Service Worker Registration ---
// Register service worker in both production and development for PWA testing
// In production, this enables offline functionality and caching
// In development, this allows testing PWA install prompts
if ('serviceWorker' in navigator) {
  // Use the 'load' event to register the service worker after the page has finished loading
  // to avoid any potential impact on initial page load performance.
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        );
        // Force update the service worker if there's a new version
        registration.update();
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// --- React App Mounting ---
const rootElement = document.getElementById('root');

// A robust check to ensure the root element exists in your index.html.
// This provides a clear error message if it's missing.
if (!rootElement) {
  throw new Error(
    "Could not find root element with id 'root' to mount the application to."
  );
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// --- Performance Monitoring ---
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
