import React, { useCallback, useContext, useState } from 'react';
import { __ } from '@wordpress/i18n';

import { ReactComponent as AiGeneratorIcon } from '../assets/images/icons/urlslab-generator.svg';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';
import { ReactComponent as LoadingIcon } from '../assets/images/icons/icon-loading.svg';
import { Button } from '../elements/JSXElements';
import MainSettings from './MainSettings';
import AdvancedSettings from './AdvancedSettings';
import GeneratedResult from './GeneratedResult';
import { AppContext } from '../app/context';
import { runResultsGenerator } from '../app/api';

import '../assets/styles/components/_Popup.scss';

const Popup: React.FC = () => {
	const [ showAdvancedSettings, setShowAdvancedSettings ] = useState( false );
	const { state, togglePopup, dispatch } = useContext( AppContext );

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
						{ ! showAdvancedSettings && <ButtonGenerate action={ () => runResultsGenerator( { state, dispatch } ) } loading={ state.generatedResults.loading } /> }
					</div>
					{ showAdvancedSettings && <>
						<AdvancedSettings />
						<ButtonGenerate action={ () => runResultsGenerator( { state, dispatch } ) } loading={ state.generatedResults.loading } />
					</>
					}
					{ state.generatedResults.opened && <GeneratedResult result={ state.generatedResults } /> }
				</div>
			</div>
		</>
	);
};

const ButtonGenerate: React.FC<{loading: boolean, action: () => void}> = ( { loading = false, action } ) => {
	const { state } = useContext( AppContext );
	return <Button
		className="icon-right"
		onClick={ action }
		active={ state.prompt.trim() !== '' }
		disabled={ state.prompt.trim() === '' || loading }
	>
		{ __( 'Generate text' ) }
		{ loading ? <LoadingIcon /> : <StarsIcon /> }
	</Button>;
};

export default React.memo( Popup );
