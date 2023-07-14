import React from 'react';
import { __ } from '@wordpress/i18n';
import { ReactComponent as AiGeneratorIcon } from '../assets/images/icons/urlslab-generator.svg';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';

const Header: React.FC<{setOpenedPopup: React.Dispatch<React.SetStateAction<boolean>>}> = ( { setOpenedPopup } ) => {
	return (
		<div className="urlslab-popup-header flex flex-align-center flex-justify-space-between">
			<div className="flex flex-align-center">
				<AiGeneratorIcon className="urlslab-popup-header-icon" />
				<h3 className="urlslab-popup-header-title">{ __( 'AI Content Assistant' ) }</h3>
			</div>
			<button className="urlslab-popup-header-close" onClick={ () => setOpenedPopup( false ) }>
				<CloseIcon />
			</button>
		</div>

	);
};

export default React.memo( Header );
