import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

export const appId = 'urlslab-ai-content-assistant';

const initApp = () => {
	const node = document.createElement( 'div' );
	node.id = appId;
	document.body.appendChild( node );

	createRoot( node ).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
};

initApp();
