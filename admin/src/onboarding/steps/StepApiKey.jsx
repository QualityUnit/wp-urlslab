import React, { useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { useQueryClient } from '@tanstack/react-query';

import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

import { handleApiError } from '../../api/fetching';
import { setSettings } from '../../api/settings';
import { postFetchModules } from '../../queries/useModulesQuery';
import { setNotification } from '../../hooks/useNotifications';
import useOnboarding from '../../hooks/useOnboarding';

import { hideWpHeaderNoApiNotification } from '../../lib/helpers';

import InputField from '../../elements/InputField';
import SvgIcon from '../../elements/SvgIcon';

const StepApiKey = ( { apiSetting } ) => {
	const queryClient = useQueryClient();
	const { activeStep, setNextStep, userData, setApiKey } = useOnboarding();
	const [ updating, setUpdating ] = useState( false );
	const [ userApiKey, setUserApiKey ] = useState( userData.apiKey );

	const apiOption = apiSetting.options[ 'flowhunt-api-key' ];

	const submitData = useCallback( async () => {
		setUpdating( true );
		setNotification( 'onboarding-apikey-step', { message: __( 'Saving API key…', 'urlslab' ), status: 'info' } );

		const response = await setSettings( `general/${ apiOption.id }`, { value: userApiKey }, { skipErrorHandling: true } );
		if ( response.ok ) {
			hideWpHeaderNoApiNotification();
			const updatedGeneralData = await response.json();
			queryClient.setQueryData( [ 'general' ], updatedGeneralData );
			queryClient.invalidateQueries( [ 'credits' ] );
			// activate serp module for paid user, needed in next steps
			await postFetchModules( [ { id: 'serp', active: true } ] );

			setNotification( 'onboarding-apikey-step', { message: __( 'API key successfully saved!', 'urlslab' ), status: 'success' } );
			setApiKey( userApiKey );
			setNextStep();
		} else {
			handleApiError( 'onboarding-apikey-step', response, { title: __( 'API key saving failed', 'urlslab' ) } );
		}

		setUpdating( false );
	}, [ userApiKey, apiOption.id, setNextStep, setApiKey, queryClient ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper small-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Integration with URLsLab', 'urlslab' ) }</h1>
				<p className="heading-description">{ apiSetting.description }</p>
			</div>

			<div className="urlslab-onboarding-content-settings">

				<div className="flex flex-justify-center">
					<div className="urlslab-onboarding-success-wrapper flex flex-align-center flex-justify-center">
						<span>{ __( 'Receive a $5 credit for free', 'urlslab' ) }</span>
					</div>
				</div>

				<InputField
					label={ __( 'API Key', 'urlslab' ) }
					description={ __( 'Connect the website and URLsLab service with an API Key.', 'urlslab' ) }
					type="password"
					defaultValue={ userApiKey }
					onChange={ ( val ) => setUserApiKey( val ) }
					liveUpdate //allow us to enable submit button immediately after api key paste
				/>

				<div className="urlslab-onboarding-content-settings-footer flex flex-align-center flex-justify-space-between">
					<div className="footer-text">
						{ __( 'I don\'t have API Key.', 'urlslab' ) }&nbsp;<Link level="body-sm" color="neutral" underline="always" href="https://app.flowhunt.io/flow/api-keys" target="_blank">{ __( 'Get API Key', 'urlslab' ) }</Link>
					</div>
					<Button
						onClick={ () => submitData() }
						loading={ updating }
						disabled={ ! userApiKey ? true : undefined }
						endDecorator={ <SvgIcon name="arrow" /> }
					>
						{ __( 'Apply and next', 'urlslab' ) }
					</Button>
				</div>

			</div>
		</div>
	);
};

export default React.memo( StepApiKey );
