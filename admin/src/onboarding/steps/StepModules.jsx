import React, { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';

import Button from '@mui/joy/Button';

import { handleApiError, postFetch } from '../../api/fetching';
import { setNotification } from '../../hooks/useNotifications';
import useOnboarding from '../../hooks/useOnboarding';
import useFreeModules from '../../hooks/useFreeModules';
import useCreditsQuery from '../../queries/useCreditsQuery';

import DashboardModule from '../../components/DashboardModule';
import PaidModulePopup from '../../components/PaidModulePopup';

import SvgIcon from '../../elements/SvgIcon';

const setFinishedOnboarding = async ( queryClient ) => {
	const response = await postFetch( 'user-info', { onboarding_finished: true } );
	if ( response.ok ) {
		queryClient.setQueryData( [ 'user-info' ], ( originalData ) => ( { ...originalData, onboarding_finished: true } ) );
	}
};

const StepModules = ( { modules } ) => {
	const queryClient = useQueryClient();
	const [ updating, setUpdating ] = useState( false );
	const [ openPopup, setOpenPopup ] = useState( false );
	const { activeStep, userData, setActiveStep, setChosenPlan, setActivateModulesData } = useOnboarding();
	const { data: creditsData } = useCreditsQuery();
	const freeModules = useFreeModules();
	const lowCredits = creditsData && parseFloat( creditsData.credits ) <= 0;

	const submitData = useCallback( async () => {
		setUpdating( true );
		setNotification( 'onboarding-modules-step', { message: __( 'Saving data…' ), status: 'info' } );

		if ( lowCredits || userData.chosenPlan === 'free' ) {
			setFinishedOnboarding( queryClient );
			setNotification( 'onboarding-modules-step', { message: __( 'Data successfully saved!' ), status: 'success' } );
			return false;
		}

		const response = await postFetch( `schedule/create`, userData.scheduleData, { skipErrorHandling: true } );
		if ( response.ok ) {
			setNotification( 'onboarding-modules-step', { message: __( 'Data successfully saved!' ), status: 'success' } );
			setFinishedOnboarding( queryClient );
		} else {
			handleApiError( 'onboarding-modules-step', { title: __( 'Data saving failed' ) } );
		}

		setUpdating( false );
	}, [ lowCredits, queryClient, userData.chosenPlan, userData.scheduleData ] );

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
										active: userData.activateModulesData[ module.id ].active,
										activationCallback: ( selected ) => {
											setActivateModulesData( module.id, selected );
										},
									} }
									showPaidModulePopup={ () => setOpenPopup( true ) }
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

				<PaidModulePopup
					open={ openPopup }
					onClose={ () => setOpenPopup( false ) }
					actionCallback={ () => {
						setOpenPopup( false );
						setActiveStep( 'api_key' );
						setChosenPlan( 'paid' );
					} }
				/>

			</div>
		</div>
	);
};

export default React.memo( StepModules );
