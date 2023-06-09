import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ScriptData } from './app/types';

declare const scriptData: ScriptData;
// used any type until wordpress provide better typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const elementor: any;

const appId = 'urlslab-ai-content-assistant';

if ( scriptData.editor_type === 'gutenberg' ) {
	wp.data.subscribe( () => {
		// let to know if app is initialized, maybe
		const appNode = document.querySelector( `#${ appId }` );
		if ( appNode ) {
			return;
		}
		const referenceNode = document.querySelector( '#editor .edit-post-header-toolbar__left' );
		if ( ! appNode && referenceNode ) {
			const node = createAppNode( referenceNode as HTMLDivElement );
			initApp( node );
		}
	} );
} else if ( scriptData.editor_type === 'elementor' ) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	elementor.hooks.addAction( 'panel/open_editor/widget', ( panel: any ) => {
		const $element = panel.content.$el.find( '#elementor-controls .elementor-control-type-wysiwyg .elementor-control-content' );
		const referenceNode = $element.length ? $element[ 0 ] : null;
		console.log( referenceNode );
		if ( referenceNode ) {
			const node = createAppNode( referenceNode, true );
			initApp( node );
		}
	} );
}

const createAppNode = ( referenceNode:HTMLDivElement, before = false ) => {
	const node = document.createElement( 'div' );
	node.id = appId;
	return referenceNode.parentNode?.insertBefore( node, before ? referenceNode : referenceNode.nextSibling );
};

const initApp = ( appNode:HTMLElement | undefined ) => {
	if ( appNode ) {
		createRoot( appNode ).render(
			<React.StrictMode>
				<App />
			</React.StrictMode>,
		);
	}
};

