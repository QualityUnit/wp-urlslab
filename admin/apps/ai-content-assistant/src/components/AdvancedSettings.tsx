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
					description={ __( 'Select language of AI model response.', 'urlslab' ) }
					//tooltipLabel={ { label: __( 'Language' , 'urlslab' ), tooltip: __( 'AI Model generate response in selected language.' , 'urlslab' ), noWrapText: true } }
				>{ __( 'Language', 'urlslab' ) }</SingleSelectMenu>
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
					description={ __( 'Explanation' , 'urlslab' ) }
					tooltipLabel={ { label: __( 'Audience' , 'urlslab' ), tooltip: __( 'tooltip text' , 'urlslab' ), noWrapText: true } }
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
					description={ __( 'Explanation' , 'urlslab' ) }
					tooltipLabel={ { label: __( 'Tone' , 'urlslab' ), tooltip: __( 'tooltip text' , 'urlslab' ), noWrapText: true } }
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
						'gpt-3.5-turbo-1106': 'OpenAI GPT 3.5 Turbo 16K',
						'gpt-4-1106-preview': 'OpenAI GPT 4 Turbo 128K',
					} }
					autoClose
					description={ __( 'Choose the appropriate model to achieve desired result.', 'urlslab' ) }
					//tooltipLabel={ { label: __( 'AI model' , 'urlslab' ), tooltip: __( 'tooltip text' , 'urlslab' ), noWrapText: true } }
				>{ __( 'AI model', 'urlslab' ) }</SingleSelectMenu>
			</div>
		</div>
	);
};

export default React.memo( AdvancedSettings );
