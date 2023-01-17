import { render } from '@wordpress/element';
import Modules from './Modules'
import './assets/styles/common/global.scss'

document.addEventListener("DOMContentLoaded", () => {
  render(
    <React.StrictMode>
      <Modules />
    </React.StrictMode>,
    document.getElementById('urlslab-settings')
  )
});
