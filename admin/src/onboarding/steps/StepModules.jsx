import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';

import Button from '@mui/joy/Button';

import { handleApiError, postFetch } from '../../api/fetching';
import { setNotification } from '../../hooks/useNotifications';
import useOnboarding from '../../hooks/useOnboarding';
import useFreeModules from '../../hooks/useFreeModules';
import useCreditsQuery from '../../queries/useCreditsQuery';
import useModulesQuery, { postFetchModules } from '../../queries/useModulesQuery';

import DashboardModule from '../../components/DashboardModule';
import PaidModulePopup from '../../components/PaidModulePopup';

import SvgIcon from '../../elements/SvgIcon';
import Switch from '../../elements/Switch';

const setFinishedOnboarding = async ( queryClient ) => {
	const response = await postFetch( 'user-info', { onboarding_finished: true } );
	if ( response.ok ) {
		queryClient.setQueryData( [ 'user-info' ], ( originalData ) => ( { ...originalData, onboarding_finished: true } ) );
	}
};

const StepModules = () => {
	const queryClient = useQueryClient();
	const [ updating, setUpdating ] = useState( false );
	const [ openPopup, setOpenPopup ] = useState( false );
	const { activeStep, userData, setActiveStep, setChosenPlan, setActivateModulesData, setAllActivateModulesData } = useOnboarding();
	const { data: creditsData } = useCreditsQuery();
	const { data: modules } = useModulesQuery();
	const freeModules = useFreeModules();
	const lowCredits = creditsData && parseFloat( creditsData.credits ) <= 0;

	const submitData = useCallback( async () => {
		setUpdating( true );

		const successNotify = () => setNotification( 'onboarding-modules-step', { message: __( 'Data successfully saved!' ), status: 'success' } );
		setNotification( 'onboarding-modules-step', { message: __( 'Saving data…' ), status: 'info' } );

		// no credit or free plan, just set onboarding as finished
		if ( lowCredits || userData.chosenPlan === 'free' ) {
			await setFinishedOnboarding( queryClient );
			successNotify();
			return false;
		}

		// paid plan, set schedule and finish onboarding process
		if ( userData.scheduleData.urls?.length ) {
			const response = await postFetch( `schedule/create`, userData.scheduleData, { skipErrorHandling: true } );
			if ( ! response.ok ) {
				handleApiError( 'onboarding-modules-step', { title: __( 'Data saving failed' ) } );
				setUpdating( false );
				return false;
			}
		}

		//activate selected modules
		await postFetchModules( Object.values( userData.activateModulesData ) );
		await setFinishedOnboarding( queryClient );

		successNotify();
		setUpdating( false );
	}, [ lowCredits, queryClient, userData.chosenPlan, userData.scheduleData, userData.activateModulesData ] );

	const markAllModules = useCallback( ( checked ) => {
		const updatedData = { ...userData.activateModulesData };
		Object.values( updatedData ).forEach( ( module ) => {
			const blockedPaid = userData.chosenPlan === 'free' && ! freeModules.includes( module.id );
			updatedData[ module.id ] = {
				id: module.id,
				active: blockedPaid ? false : checked,
			};
		} );
		setAllActivateModulesData( updatedData );
	}, [ freeModules, setAllActivateModulesData, userData.activateModulesData, userData.chosenPlan ] );

	// make sure the paid modules are not selected in free plan, if they were selected ie. in last step of paid plan
	useEffect( () => {
		if ( userData.chosenPlan === 'free' ) {
			Object.values( userData.activateModulesData ).forEach( ( module ) => {
				if ( ! freeModules.includes( module.id ) && module.active ) {
					setActivateModulesData( module.id, false );
				}
			} );
		}
	}, [ userData.chosenPlan, userData.activateModulesData, freeModules, setActivateModulesData ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper small-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Select modules' ) }</h1>
				<p className="heading-description">{ __( 'Choose the best modules for your requirements. We recommend using all of them for maximum SEO optimization and website performance.' ) }</p>
			</div>

			<div className="urlslab-onboarding-content-settings">

				<div className="urlslab-onboarding-content-settings-modules">

					<div className="urlslab-dashboardmodule select-all">
						<h3 className="urlslab-dashboardmodule-title">{ __( 'Select all modules' ) }</h3>
						<Switch
							secondary
							onChange={ ( checked ) => markAllModules( checked ) }
							className="urlslab-dashboardmodule-switch ma-left"
						/>
					</div>

					{ Object.values( modules ).map( ( module ) => {
						return (
							module.id !== 'general'
								? <DashboardModule
									key={ module.id }
									className={ `${ module.id }-wrapper` }
									module={ module }
									onboardingData={ {
										userPlan: userData.chosenPlan,
										active: userData.activateModulesData[ module.id ]?.active,
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
