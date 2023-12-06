import React, { useCallback, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import { handleApiError, postFetch } from '../../api/fetching';
import { setNotification } from '../../hooks/useNotifications';
import useOnboarding from '../../hooks/useOnboarding';
import useCreditsQuery from '../../queries/useCreditsQuery';

import DashboardModule from '../../components/DashboardModule';

import SvgIcon from '../../elements/SvgIcon';
import SimpleModal from '../../elements/SimpleModal';

const freeModules = [
	'urlslab-keywords-links',
	'urlslab-media-offloader',
	'urlslab-cache',
	'urlslab-lazy-loading',
	'urlslab-css-optimizer',
	'urlslab-urls',
	'redirects',
	'web-vitals',
	'urlslab-search-and-replace',
	'urlslab-custom-html',
	'optimize',
];

const StepModules = ( { modules } ) => {
	const { __ } = useI18n();
	const [ updating, setUpdating ] = useState( false );
	const [ openPopup, setOpenPopup ] = useState( false );
	const { activeStep, userData, setActiveOnboarding, setActiveStep, setChosenPlan } = useOnboarding();
	const { data: creditsData } = useCreditsQuery();

	const lowCredits = creditsData && parseFloat( creditsData.credits ) <= 0;

	const submitData = useCallback( async () => {
		if ( lowCredits ) {
			setActiveOnboarding( false );
			return false;
		}

		setUpdating( true );
		setNotification( 'onboarding-modules-step', { message: __( 'Saving data…' ), status: 'info' } );

		const response = await postFetch( `schedule/create`, userData.scheduleData, { skipErrorHandling: true } );
		if ( response.ok ) {
			setNotification( 'onboarding-modules-step', { message: __( 'Data successfully saved!' ), status: 'success' } );
			setActiveOnboarding( false );
		} else {
			handleApiError( 'onboarding-modules-step', { title: __( 'Data saving failed' ) } );
		}

		setUpdating( false );
	}, [ lowCredits, userData.scheduleData, __, setActiveOnboarding ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper small-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Select modules' ) }</h1>
				<p className="heading-description">{ __( 'Choose the best modules for your requirements. We recommend using all of them for maximum SEO optimization and website performance.' ) }</p>
			</div>

			<div className="urlslab-onboarding-content-settings">

				<div className="urlslab-onboarding-content-settings-modules">
					{ modules.map( ( module ) => {
						return (
							module.id !== 'general'
								? <DashboardModule
									key={ module.id }
									module={ module }
									onboardingData={ {
										moduleType: freeModules.includes( module.id ) ? 'free' : 'paid',
										userPlan: userData.chosenPlan,
										callback: () => setOpenPopup( true ),
									} }
								/>
								: null
						);
					} )
					}
				</div>

				<div className="urlslab-onboarding-content-settings-footer flex flex-justify-end">
					<Button
						onClick={ () => submitData() }
						loading={ updating }
						endDecorator={ <SvgIcon name="arrow" /> }
					>
						{ __( 'Finish and go to plugin' ) }
					</Button>
				</div>

				<SimpleModal
					open={ openPopup }
					title={ __( 'Paid module' ) }
					cancelButtonText={ 'Continue with free plan' }
					onClose={ () => setOpenPopup( false ) }
					actionButton={
						<Button onClick={ () => {
							setOpenPopup( false );
							setActiveStep( 'api_key' );
							setChosenPlan( 'paid' );
						} }>
							{ __( 'Insert API Key' ) }
						</Button>
					}
					cancelButton
				>
					{ __( 'You are trying to activate paid module. API Key is required to continue.' ) }
				</SimpleModal>
			</div>
		</div>
	);
};

export default React.memo( StepModules );
