import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ScriptData } from './types';
import { appId } from '../main';

// declare globals
declare const scriptData: ScriptData;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any; // used any type until wordpress provide better typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const elementor: any; // used any type until wordpress provide better typing

export const useOutsideClick = <T extends HTMLElement>( ref: React.RefObject<T>, callback: () => void ) => {
	useEffect( () => {
		const handleClick = ( event: MouseEvent ) => {
			if ( ref.current && ! ref.current.contains( event.target as Node ) ) {
				callback();
			}
		};
		document.addEventListener( 'click', handleClick );
		return () => {
			document.removeEventListener( 'click', handleClick );
		};
	}, [ ref, callback ] );
};

export const useEditorListener = ( Button: JSX.Element ) => {
	useEffect( () => {
		if ( scriptData.editor_type === 'gutenberg' ) {
		// subscribe to editor, node for button may
			wp?.data.subscribe( () => {
				const buttonWrapperNode = document.querySelector( `#${ appId }-button-wrapper` );
				if ( buttonWrapperNode ) {
					return;
				}
				const referenceNode = document.querySelector( '#editor .edit-post-header-toolbar__left' ) as HTMLDivElement;
				if ( ! buttonWrapperNode && referenceNode ) {
					createButton( Button, referenceNode );
				}
			} );
		} else if ( scriptData.editor_type === 'elementor' ) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			elementor?.channels.editor.on( 'section:activated', ( activeSection: string, data: any ) => {
				// double check if we are in correct widget
				if ( activeSection === 'section_editor' && data.model.attributes.widgetType === 'text-editor' ) {
					const buttonWrapperNode = document.querySelector( `#${ appId }-button-wrapper` );
					if ( buttonWrapperNode ) {
						return;
					}
					const referenceNode = data.el.querySelector( '#elementor-controls .elementor-control-type-wysiwyg .elementor-control-content' ) as HTMLDivElement;
					if ( ! buttonWrapperNode && referenceNode ) {
						createButton( Button, referenceNode, true );
					}
				}
			} );
		}
	}, [ Button ] );
};

const createButton = ( Button: JSX.Element, referenceNode:HTMLDivElement, before = false ) => {
	const node = document.createElement( 'div' );
	node.id = `${ appId }-button-wrapper`;
	referenceNode.parentNode?.insertBefore( node, before ? referenceNode : referenceNode.nextSibling );
	ReactDOM.render( Button, node );
};

