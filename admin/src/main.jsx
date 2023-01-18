import React from 'react'
import { createRoot } from '@wordpress/element'
import Modules from './Modules'
import './assets/styles/common/global.scss'
import App from './App'

createRoot(document.getElementById('urlslab-settings')).render(
  <React.StrictMode>
    <Modules />
    <App />
  </React.StrictMode>
)
