import React, { useCallback, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';

import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

import { setSettings } from '../../api/settings';
import { setNotification } from '../../hooks/useNotifications';
import useOnboarding from '../../hooks/useOnboarding';
import InputField from '../../elements/InputField';

import SvgIcon from '../../elements/SvgIcon';
import { handleApiError } from '../../api/fetching';

const StepApiKey = ( { apiSetting } ) => {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { activeStep, setNextStep, userData, setApiKey } = useOnboarding();
	const [ updating, setUpdating ] = useState( false );
	const [ userApiKey, setUserApiKey ] = useState( userData.apiKey );

	const apiOption = apiSetting.options[ 'urlslab-api-key' ];

	const submitData = useCallback( async () => {
		setUpdating( true );
		setNotification( 'onboarding-apikey-step', { message: __( 'Saving API key…' ), status: 'info' } );

		const response = await setSettings( `general/${ apiOption.id }`, { value: userApiKey }, { skipErrorHandling: true } );
		if ( response.ok ) {
			setNotification( 'onboarding-apikey-step', { message: __( 'API key successfully saved!' ), status: 'success' } );
			setApiKey( userApiKey );
			queryClient.invalidateQueries( [ 'credits' ] );
			setNextStep();
		} else {
			handleApiError( 'onboarding-apikey-step', { title: __( 'API key saving failed' ) } );
		}

		setUpdating( false );
	}, [ userApiKey, apiOption.id, __, setNextStep, setApiKey, queryClient ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper small-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Integration with URLsLab' ) }</h1>
				<p className="heading-description">{ apiSetting.description }</p>
			</div>

			<div className="urlslab-onboarding-content-settings">

				<div className="flex flex-justify-center">
					<div className="urlslab-onboarding-success-wrapper flex flex-align-center flex-justify-center">
						<span>{ __( 'Receive a $5 credit for free' ) }</span>
					</div>
				</div>

				<InputField
					label={ __( 'API Key' ) }
					description={ __( 'Connect the website and URLsLab service with an API Key.' ) }
					type="password"
					defaultValue={ userApiKey }
					onChange={ ( val ) => setUserApiKey( val ) }
					liveUpdate //allow us to enable submit button immediately after api key paste
				/>

				<div className="urlslab-onboarding-content-settings-footer flex flex-align-center flex-justify-space-between">
					<div className="footer-text">
						{ __( 'I don\'t have API Key.' ) }&nbsp;<Link level="body-sm" color="neutral" underline="always" href="https://www.urlslab.com/login/" target="_blank">{ __( 'Get API Key' ) }</Link>
					</div>
					<Button
						onClick={ () => submitData() }
						loading={ updating }
						disabled={ ! userApiKey ? true : undefined }
						endDecorator={ <SvgIcon name="arrow" /> }
					>
						{ __( 'Apply and next' ) }
					</Button>
				</div>

			</div>
		</div>
	);
};

export default React.memo( StepApiKey );
