import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { createHigherOrderComponent } from '@wordpress/compose';
import { AITooltipWrapper } from './components/AITooltipWrapper.js';

export const appId = 'urlslab-ai-content-assistant';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any; // used any type until wordpress provide better typing

const initApp = () => {
	const node = document.createElement( 'div' );
	node.id = appId;
	document.body.appendChild( node );

	wp?.hooks.addFilter(
		'editor.BlockEdit',
		'urlslab/with-tooltip',
		createHigherOrderComponent( ( BlockEdit ) => {
			return ( props ) => {
				console.log( props );
				if ( props.name === 'core/paragraph' ) {
					return (
						<>
							<AITooltipWrapper>
								<BlockEdit { ...props } />
							</AITooltipWrapper>
						</>
					);
				}
				return <BlockEdit { ...props } />;
			};
		}, 'withTooltip' ),
	);

	createRoot( node ).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
};

initApp();
