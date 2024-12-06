import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './main.css'

// biome-ignore lint/style/noNonNullAssertion:
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
