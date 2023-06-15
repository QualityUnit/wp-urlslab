import React, { useContext, useState } from 'react';
import { __ } from '@wordpress/i18n';

import { Button, SingleSelectMenu, TextArea } from '../elements/JSXElements';
import { AppContext } from '../app/context';
import GenericDropdown from '../elements/GenericDropdown';
import UrlsList from './options/UrlsList';
import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';
import { ReactComponent as ArrowsOuterIcon } from '../assets/images/icons/icon-arrows-direction-outer.svg';
import { ReactComponent as ArrowsInsideIcon } from '../assets/images/icons/icon-arrows-direction-inside.svg';
declare const wp: any; // used any type until wordpress provide better typing
//import { registerBlockType, createBlock } from '@wordpress/blocks';
import '../assets/styles/components/_GeneratedResult.scss';

const fakeText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const GeneratedResult: React.FC = () => {
	const [ text, setText ] = useState( fakeText );
	const addIntoEditor = () => {
		/*const block = wp.blocks.createBlock( 'core/paragraph', {
			content: text,
		} );*/
		//const currentBlocks = wp.data.select( 'core/block-editor' ).getBlocks();
		//wp.data.dispatch( 'core/editor' ).insertBlock( block, 0 );

		const lines = text.split( '\n' );
		const blocks = lines.map( ( line ) => {
			return wp.blocks.createBlock( 'core/paragraph', {
				content: line,
			} );
		} );
		wp.data.dispatch( 'core/block-editor' ).insertBlocks( blocks, 0 );
	};

	return (
		<div className="urlslab-GeneratedResult flex flex-column">
			<TextArea
				label={ __( 'Generated text' ) }
				rows={ 11 }
				defaultValue={ text }
				onChange={ ( value ) => setText( value ) }
			/>
			<div className="urlslab-GeneratedResult-action-buttons">
				<Button
					className=""
					onClick={ () => console.log( 'generate' ) }
				>
					<StarsIcon />
					{ __( 'Fix spelling & grammar' ) }
				</Button>
				<Button
					className=""
					onClick={ () => console.log( 'generate' ) }
				>
					<ArrowsOuterIcon />
					{ __( 'Make it longer' ) }
				</Button>
				<Button
					className=""
					onClick={ () => console.log( 'generate' ) }
				>
					<ArrowsInsideIcon />
					{ __( 'Make it shorter' ) }
				</Button>
			</div>
			<div className="urlslab-GeneratedResult-submit-section flex flex-justify-end">
				{ /* // Will be used soon.
				<Button
					className=""
					onClick={ () => {} }
				>
					{ __( 'Save settings as new template' ) }
				</Button>
				*/ }
				<Button
					className=""
					onClick={ addIntoEditor }
					active
				>
					{ __( 'Use text' ) }
				</Button>
			</div>
		</div>
	);
};

export default React.memo( GeneratedResult );
