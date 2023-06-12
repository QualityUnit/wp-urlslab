import React, { useCallback, useContext, useState } from 'react';
import { ReactComponent as AiGeneratorIcon } from '../assets/images/icons/urlslab-generator.svg';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import { __ } from '@wordpress/i18n';

import '../assets/styles/components/_Popup.scss';
import { Button } from '../elements/JSXElements';
import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';
import MainSettings from './MainSettings';
import AdvancedSettings from './AdvancedSettings';
import { AppContext } from '../app/context';
import GeneratedResult from './GeneratedResult';

const Popup: React.FC = () => {
	const [ showAdvancedSettings, setShowAdvancedSettings ] = useState( false );

	const { togglePopup } = useContext( AppContext );

	const toggleAdvancedSettings = useCallback( () => {
		setShowAdvancedSettings( ! showAdvancedSettings );
	}, [ showAdvancedSettings ] );

	return (
		<>
			<div className="urlslab-page-overlay" onClick={ togglePopup } aria-hidden="true"></div>
			<div className="urlslab-popup flex flex-column flex-justify-center flex-align-center">
				<div className="urlslab-popup-header flex flex-align-center flex-justify-space-between">
					<div className="flex flex-align-center">
						<AiGeneratorIcon className="urlslab-popup-header-icon" />
						<h3 className="urlslab-popup-header-title">{ __( 'AI Content Assistant' ) }</h3>
					</div>
					<button className="urlslab-popup-header-close" onClick={ togglePopup }>
						<CloseIcon />
					</button>
				</div>
				<div className="urlslab-popup-content">

					<MainSettings />
					<div className="flex flex-justify-space-between">
						<Button className={ `simple underline with-arrow ${ showAdvancedSettings ? 'flip-arrow' : '' }` } onClick={ toggleAdvancedSettings }>{ __( 'Advanced settings' ) }</Button>
						{ ! showAdvancedSettings && <ButtonGenerate /> }
					</div>
					{ showAdvancedSettings && <>
						<AdvancedSettings />
						<ButtonGenerate />
					</>
					}
					<GeneratedResult />
				</div>
			</div>
		</>
	);
};

const ButtonGenerate: React.FC = () => {
	return <Button className="icon-right" onClick={ () => console.log( 'generate' ) } active >{ __( 'Generate text' ) }<StarsIcon width="17px" height="18px" /></Button>;
};

export default React.memo( Popup );
