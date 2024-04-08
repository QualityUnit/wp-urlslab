import React, { useContext } from 'react';
import { __ } from '@wordpress/i18n';

import { InputField, TextArea } from '../elements/JSXElements';
import { AppContext } from '../app/context';
import GenericDropdown from '../elements/GenericDropdown';
import UrlsList from './UrlsList';

const MainSettings: React.FC = () => {
	const { state, dispatch } = useContext( AppContext );
	return (
		<div className="urlslab-popup-content-main-settings flex flex-column">
			{ /* // Will be used soon in further release.
			<div className="urlslab-popup-content-option-wrapper">
				<SingleSelectMenu
					defaultValue={ state.template }
					onChange={ ( value ) => dispatch( { type: 'template', payload: value } ) }
					name="template"
					items={ {
						item_a: 'First item',
						item_b: 'Second item',
					} }
					autoClose
				>
					{ __( 'Template' , 'wp-urlslab' ) }
				</SingleSelectMenu>
			</div>
			*/ }
			<div className="urlslab-popup-content-option-wrapper">
				<TextArea
					label={ __( 'Prompt', 'wp-urlslab' ) }
					description={ __( 'Clear instruction or question to guide the model\'s response.', 'wp-urlslab' ) }
					placeholder={ __( 'Type here', 'wp-urlslab' ) }
					defaultValue={ state.prompt }
					onChange={ ( value ) => dispatch( { type: 'prompt', payload: value } ) }
					liveUpdate
					allowResize
				/>
			</div>
			<div className="urlslab-popup-content-option-wrapper">
				<InputField
					label={ __( 'Semantic context', 'wp-urlslab' ) }
					description={ __( 'Include relevant context for more accurate response filtered from urls in Url filter.', 'wp-urlslab' ) }
					placeholder={ __( 'Type here', 'wp-urlslab' ) }
					defaultValue={ state.semantic_context }
					onChange={ ( value ) => dispatch( { type: 'semantic_context', payload: value } ) }
					liveUpdate
				/>
			</div>
			<div className="urlslab-popup-content-option-wrapper">
				<GenericDropdown
					label={ __( 'URL filter', 'wp-urlslab' ) }
					innerLabel={ __( 'Select or add urls', 'wp-urlslab' ) }
					description={ __( 'Select or add urls to fetch data from.', 'wp-urlslab' ) }
				>
					<UrlsList urls={ state.url_filter } />
				</GenericDropdown>
			</div>
		</div>
	);
};

export default React.memo( MainSettings );
