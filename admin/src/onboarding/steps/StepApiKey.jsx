import React, { useCallback, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';

import { setSettings } from '../../api/settings';
import { setNotification } from '../../hooks/useNotifications';
import useOnboarding from '../../hooks/useOnboarding';
import InputField from '../../elements/InputField';
import Button from '../../elements/Button';

import { ReactComponent as DollarIcon } from '../../assets/images/icons/icon-dollar.svg';
import { ReactComponent as ArrowIcon } from '../../assets/images/icons/icon-arrow.svg';

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

		const response = await setSettings( `general/${ apiOption.id }`, { value: userApiKey } );
		if ( response.ok ) {
			setNotification( 'onboarding-apikey-step', { message: __( 'API key successfully saved!' ), status: 'success' } );
			setApiKey( userApiKey );
			queryClient.invalidateQueries( [ 'credits' ] );
			setNextStep();
		} else {
			setNotification( 'onboarding-apikey-step', { message: __( 'API key saving failed.' ), status: 'error' } );
		}

		setUpdating( false );
	}, [ userApiKey, apiOption.id, __, setNextStep, setApiKey, queryClient ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper small-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'URLsLab Integration' ) }</h1>
				<p className="heading-description">{ apiSetting.description }</p>
			</div>

			<div className="urlslab-onboarding-content-settings">

				<div className="flex flex-justify-center">
					<div className="urlslab-onboarding-success-wrapper flex flex-align-center flex-justify-center">
						<DollarIcon />
						<span>{ __( 'With API key you receive 5 dollars in credits for free' ) }</span>
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
						{ __( 'I don\'t have API Key.' ) }&nbsp;<Button className="simple underline" href="https://www.urlslab.com/login/" target="_blank">{ __( 'Get API Key' ) }</Button>
					</div>
					<Button
						className="active"
						onClick={ () => submitData() }
						disabled={ ! userApiKey || updating }
					>
						<span>{ __( 'Apply and next' ) }</span>
						<ArrowIcon />
					</Button>
				</div>

			</div>
		</div>
	);
};

export default React.memo( StepApiKey );
