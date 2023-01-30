import React from 'react';
import { createRoot } from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';

import App from './App';

const queryClient = new QueryClient();

createRoot( document.getElementById( 'urlslab-root' ) ).render(
	<React.StrictMode>
		<QueryClientProvider client={ queryClient }>
			<App />
		</QueryClientProvider>
	</React.StrictMode>
);
