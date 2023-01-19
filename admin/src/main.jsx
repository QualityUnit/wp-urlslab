import React from 'react'
<<<<<<< HEAD
import { createRoot } from '@wordpress/element'
=======
import { render } from '@wordpress/element'
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
import Modules from './Modules'
import './assets/styles/common/global.scss'
import App from './App'

<<<<<<< HEAD
createRoot(document.getElementById('urlslab-settings')).render(
  <React.StrictMode>
    <Modules />
    <App />
  </React.StrictMode>
)
=======
// window.addEventListener('load', () => {
render(
  <React.StrictMode>
    <Modules />
  </React.StrictMode>,
  document.getElementById('urlslab-settings')
)
// })
>>>>>>> 0be67eb26c4155736a6ac5a662c6545495238e7b
