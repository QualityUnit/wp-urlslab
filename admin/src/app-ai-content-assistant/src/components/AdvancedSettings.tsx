import React, { useContext } from 'react';
import { __ } from '@wordpress/i18n';

import { SingleSelectMenu } from '../elements/JSXElements';
import { AppContext } from '../app/context';
import InputWithSlider from '../elements/InputWithSlider';

const AdvancedSettings: React.FC = () => {
	const { state, dispatch } = useContext( AppContext );
	return (
		<div className="urlslab-popup-content-advanced-settings urlslab-half-columns">
			<div className="urlslab-half-columns-col">
				<SingleSelectMenu
					defaultValue={ state.language }
					onChange={ ( value ) => dispatch( { type: 'semantic_context', payload: value } ) }
					name="semantic_context"
					items={ {
						item_a: 'Language 1',
						item_b: 'Language 2',
						item_c: 'Language 3',
						item_d: 'Language 4',
					} }
					autoClose
					description={ __( 'Explanation' ) }
					tooltipLabel={ { label: __( 'Language' ), tooltip: __( 'tooltip text' ) } }
				></SingleSelectMenu>
			</div>

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
					tooltipLabel={ { label: __( 'Audience' ), tooltip: __( 'tooltip text' ) } }
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
					tooltipLabel={ { label: __( 'Tone' ), tooltip: __( 'tooltip text' ) } }
				></SingleSelectMenu>
			</div>

			<div className="urlslab-half-columns-col">
				<InputWithSlider
					label={ __( 'Length' ) }
					description={ __( 'Explanation' ) }
					value={ state.length }
					max={ 800 }
					step={ 10 }
					onChange={ ( event ) => {
						dispatch( { type: 'length', payload: event.target.value } );
					} } />

			</div>

			<div className="urlslab-half-columns-col">
				<SingleSelectMenu
					defaultValue={ state.ai_model }
					onChange={ ( value ) => dispatch( { type: 'ai_model', payload: value } ) }
					name="ai_model"
					items={ {
						item_a: 'Option 1',
						item_b: 'Option 2',
					} }
					autoClose
					description={ __( 'Explanation' ) }
					tooltipLabel={ { label: __( 'AI model' ), tooltip: __( 'tooltip text' ) } }
				></SingleSelectMenu>
			</div>
		</div>
	);
};

export default React.memo( AdvancedSettings );
