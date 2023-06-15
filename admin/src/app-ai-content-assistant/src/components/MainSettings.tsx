import React, { useContext } from 'react';
import { __ } from '@wordpress/i18n';

import { TextArea } from '../elements/JSXElements';
import { AppContext } from '../app/context';
import GenericDropdown from '../elements/GenericDropdown';
import UrlsList from './options/UrlsList';

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
					{ __( 'Template' ) }
				</SingleSelectMenu>
			</div>
			*/ }
			<div className="urlslab-popup-content-option-wrapper">
				<TextArea
					label={ __( 'Prompt' ) }
					description={ __( 'Maximum number of times' ) }
					placeholder={ __( 'Type here' ) }
					defaultValue={ state.prompt }
					onChange={ ( value ) => dispatch( { type: 'prompt', payload: value } ) }
					liveUpdate
					allowResize
				/>
			</div>
			<div className="urlslab-popup-content-option-wrapper">
				<GenericDropdown
					label={ __( 'Semantic context' ) }
					innerLabel={ __( 'Select or add url' ) }
					description={ __( 'Explanation of what semantic means' ) }
				>
					<UrlsList urls={ state.semantic_context.urls } />
				</GenericDropdown>
			</div>
		</div>
	);
};

export default React.memo( MainSettings );
