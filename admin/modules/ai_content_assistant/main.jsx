import React from 'react';
import { createRoot } from 'react-dom';
import App from './App';
// eslint-disable-next-line no-console
console.log( 'assistants app' );

createRoot( document.getElementById( 'urlslab-ai-content-assistent-root' ) ).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

