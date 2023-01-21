import React from 'react';
import { render } from '@wordpress/element';
import App from './App';

render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById( 'urlslab-root' ),
);
