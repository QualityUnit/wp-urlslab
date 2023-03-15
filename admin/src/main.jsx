/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createRoot } from 'react-dom';

import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';

import App from './App';

import { clear } from 'idb-keyval';

clear();

const queryClient = new QueryClient( {
	defaultOptions: {
		queries: {
			cacheTime: 1000 * 60 * 60 * 24, // 24 hours
		},
	},
} );

createRoot( document.getElementById( 'urlslab-root' ) ).render(
	<React.StrictMode>
		<QueryClientProvider client={ queryClient } >
			<App />
		</QueryClientProvider>
	</React.StrictMode>
);
