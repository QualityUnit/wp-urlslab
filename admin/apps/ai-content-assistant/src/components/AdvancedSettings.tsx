import React, { useContext } from 'react';
import { __ } from '@wordpress/i18n';

import { SingleSelectMenu } from '../elements/JSXElements';
import { AppContext } from '../app/context';

const tempLanguages = {
	en: 'English (United States)',
	es: 'Spanish',
	'pt-br': 'Portuguese (Brazil)',
	de: 'German',
};

const AdvancedSettings: React.FC = () => {
	const { state, dispatch } = useContext( AppContext );
	return (
		<div className="urlslab-popup-content-advanced-settings urlslab-half-columns">
			<div className="urlslab-half-columns-col">
				<SingleSelectMenu
					defaultValue={ state.language }
					onChange={ ( value ) => dispatch( { type: 'language', payload: value } ) }
					name="language"
					items={ tempLanguages }
					autoClose
					description={ __( 'Select language of AI model response.' ) }
					//tooltipLabel={ { label: __( 'Language' ), tooltip: __( 'AI Model generate response in selected language.' ), noWrapText: true } }
				>{ __( 'Language' ) }</SingleSelectMenu>
			</div>
			{ /* will be used in next release
			<div className="urlslab-half-columns-col">
				<SingleSelectMenu
					defaultValue={ state.audience }
					onChange={ ( value ) => dispatch( { type: 'audience', payload: value } ) }
					name="audience"
					items={ {
						item_a: 'Option 1',
						item_b: 'Option 2',
					} }
					autoClose
					description={ __( 'Explanation' ) }
					tooltipLabel={ { label: __( 'Audience' ), tooltip: __( 'tooltip text' ), noWrapText: true } }
				></SingleSelectMenu>
			</div>

			<div className="urlslab-half-columns-col">
				<SingleSelectMenu
					defaultValue={ state.tone }
					onChange={ ( value ) => dispatch( { type: 'tone', payload: value } ) }
					name="tone"
					items={ {
						item_a: 'Option 1',
						item_b: 'Option 2',
					} }
					autoClose
					description={ __( 'Explanation' ) }
					tooltipLabel={ { label: __( 'Tone' ), tooltip: __( 'tooltip text' ), noWrapText: true } }
				></SingleSelectMenu>
			</div>
			*/ }
			<div className="urlslab-half-columns-col">
				<SingleSelectMenu
					defaultValue={ state.ai_model }
					onChange={ ( value ) => dispatch( { type: 'ai_model', payload: value } ) }
					name="ai_model"
					items={ {
						// do not translate product names
						'gpt-3.5-turbo': 'OpenAI GPT 3.5 Turbo',
						'gpt-4': 'OpenAI GPT 4',
						'text-davinci-003': 'OpenAI GPT Davinci 003',
					} }
					autoClose
					description={ __( 'Choose the appropriate model to achieve desired result.' ) }
					//tooltipLabel={ { label: __( 'AI model' ), tooltip: __( 'tooltip text' ), noWrapText: true } }
				>{ __( 'AI model' ) }</SingleSelectMenu>
			</div>
		</div>
	);
};

export default React.memo( AdvancedSettings );
