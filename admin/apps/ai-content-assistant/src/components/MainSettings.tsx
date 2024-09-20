import React, { useContext } from 'react';
import { __ } from '@wordpress/i18n';

import { TextArea } from '../elements/JSXElements';
import { AppContext } from '../app/context';

const MainSettings: React.FC = () => {
	const { state, dispatch } = useContext( AppContext );
	return (
		<div className="urlslab-popup-content-main-settings flex flex-column">
			<div className="urlslab-popup-content-option-wrapper">
				<TextArea
					label={ __( 'Prompt', 'urlslab' ) }
					description={ __( 'Clear instruction or question to guide the model\'s response.', 'urlslab' ) }
					placeholder={ __( 'Type here', 'urlslab' ) }
					defaultValue={ state.prompt }
					onChange={ ( value ) => dispatch( { type: 'prompt', payload: value } ) }
					liveUpdate
					allowResize
				/>
			</div>
		</div>
	);
};

export default React.memo( MainSettings );
