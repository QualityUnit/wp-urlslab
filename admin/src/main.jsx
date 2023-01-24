import React from 'react';
import { createRoot } from 'react-dom';
import App from './App';

createRoot( document.getElementById( 'urlslab-root' ) ).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
