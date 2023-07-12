import React, { useCallback, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { setSettings } from '../../api/settings';
import { setNotification } from '../../hooks/useNotifications';
import useOnboarding from '../../hooks/useOnboarding';
import InputField from '../../elements/InputField';
import Button from '../../elements/Button';

import { ReactComponent as DollarIcon } from '../../assets/images/icons/icon-dollar.svg';
import { ReactComponent as ArrowIcon } from '../../assets/images/icons/icon-arrow.svg';

const StepApiKey = ( { apiSetting } ) => {
	const { __ } = useI18n();
	const { activeStep, setNextStep } = useOnboarding();
	const [ data, setData ] = useState( { api_key: apiSetting.options[ 'urlslab-api-key' ].value } );
	const [ updating, setUpdating ] = useState( false );

	const apiOption = apiSetting.options[ 'urlslab-api-key' ];

	const setApiKey = useCallback( ( api_key ) => {
		setData( { api_key } );
	}, [] );

	const submitData = useCallback( async () => {
		setUpdating( true );
		setNotification( 'onboarding-apikey-step', { message: __( 'Saving API key…' ), status: 'info' } );

		const response = await setSettings( `general/${ apiOption.id }`, { value: data.api_key } );
		if ( response.ok ) {
			setNotification( 'onboarding-apikey-step', { message: __( 'API key successfully saved!' ), status: 'success' } );
			setNextStep();
		} else {
			setNotification( 'onboarding-apikey-step', { message: __( 'API key saving failed.' ), status: 'error' } );
		}

		setUpdating( false );
	}, [ data, __, setNextStep, apiOption.id ] );

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
						{ __( 'With API key you receive 5 dollars in credits for free' ) }
					</div>
				</div>

				<InputField
					label={ __( 'API Key' ) }
					description={ __( 'Connect the website and URLsLab service with an API Key.' ) }
					type="password"
					defaultValue={ data.api_key }
					onChange={ ( val ) => setApiKey( val ) }
					liveUpdate //allow us to enable submit button immediately after api key paste
				/>

				<div className="urlslab-onboarding-content-settings-footer flex flex-align-center flex-justify-space-between">
					<div className="footer-text">
						{ __( 'I don\'t have API Key.' ) }&nbsp;<Button className="simple underline" href="https://www.urlslab.com/login/" target="_blank">{ __( 'Get API Key' ) }</Button>
					</div>
					<Button
						className="active"
						onClick={ () => submitData() }
						disabled={ ! data.api_key || updating }
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
