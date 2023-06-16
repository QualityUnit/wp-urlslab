import React, { useContext } from 'react';
import { __ } from '@wordpress/i18n';

import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';
import { ReactComponent as ArrowsOuterIcon } from '../assets/images/icons/icon-arrows-direction-outer.svg';
import { ReactComponent as ArrowsInsideIcon } from '../assets/images/icons/icon-arrows-direction-inside.svg';
import { Button, TextArea } from '../elements/JSXElements';
import { AppContext } from '../app/context';
import { runResultsGenerator } from '../app/api';
import { ScriptData } from '../app/types';

import '../assets/styles/components/_GeneratedResult.scss';

// declare globals
declare const scriptData: ScriptData;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any; // used any type until wordpress provide better typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const elementor: any; // used any type until wordpress provide better typing

const GeneratedResult: React.FC<{result: { text: string, loading: boolean}}> = ( { result } ) => {
	const { state, dispatch, togglePopup } = useContext( AppContext );

	const setText = ( text: string ) => {
		dispatch( { type: 'generatedResults', payload: { ...state.generatedResults, text } } );
	};

	const addIntoEditor = () => {
		if ( scriptData.editor_type === 'gutenberg' ) {
			wp.data.dispatch( 'core/block-editor' ).insertBlock( wp.blocks.createBlock( 'core/paragraph', {
				content: result.text.replace( /\n/g, '<br>' ),
			} ), 0 );
		} else if ( scriptData.editor_type === 'elementor' ) {
			const view = elementor?.getPanelView().getCurrentPageView();
			if ( view ) {
				const editorType = view.model.get( 'settings' ).controls.editor.type;
				const text = editorType === 'wysiwyg' ? result.text.replace( /\n/g, '<br>' ) : result.text;
				view.model.setSetting( 'editor', text );
				view.render();
			}
		}
		togglePopup();
	};

	return (
		<div className="urlslab-GeneratedResult flex flex-column">
			<TextArea
				key={ result.text } // hotfix to rerender component after next generating :/
				label={ __( 'Generated text' ) }
				rows={ 11 }
				defaultValue={ result.text }
				disabled={ result.loading }
				onChange={ ( value ) => setText( value ) }
				liveUpdate
			/>
			<div className="urlslab-GeneratedResult-action-buttons">
				<Button
					className=""
					onClick={ () => runResultsGenerator( { state, dispatch }, { text: result.text, type: 'fix_grammar' } ) }
					disabled={ result.loading }
				>
					<StarsIcon />
					{ __( 'Fix spelling & grammar' ) }
				</Button>
				<Button
					className=""
					onClick={ () => runResultsGenerator( { state, dispatch }, { text: result.text, type: 'make_longer' } ) }
					disabled={ result.loading }
				>
					<ArrowsOuterIcon />
					{ __( 'Make it longer' ) }
				</Button>
				<Button
					className=""
					onClick={ () => runResultsGenerator( { state, dispatch }, { text: result.text, type: 'make_shorter' } ) }
					disabled={ result.loading }
				>
					<ArrowsInsideIcon />
					{ __( 'Make it shorter' ) }
				</Button>
			</div>
			<div className="urlslab-GeneratedResult-submit-section flex flex-justify-end">
				{ /* // Will be used soon in further release.
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
					active={ state.generatedResults.text !== '' }
					disabled={ state.generatedResults.text === '' }
				>
					{ __( 'Use text' ) }
				</Button>
			</div>
		</div>
	);
};

export default React.memo( GeneratedResult );
