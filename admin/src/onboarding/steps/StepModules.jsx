import React, { useCallback, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { setNotification } from '../../hooks/useNotifications';
import { postFetch } from '../../api/fetching';
import useOnboarding from '../../hooks/useOnboarding';
import useCreditsQuery from '../../hooks/useCreditsQuery';
import DashboardModule from '../../components/DashboardModule';
import Button from '../../elements/Button';

import { ReactComponent as ArrowIcon } from '../../assets/images/icons/icon-arrow.svg';

const StepModules = ( { modules } ) => {
	const { __ } = useI18n();
	const [ updating, setUpdating ] = useState( false );
	const { activeStep, userData, setActiveOnboarding } = useOnboarding();
	const { data: creditsData } = useCreditsQuery();

	const lowCredits = creditsData && parseFloat( creditsData.credits ) <= 0;

	const submitData = useCallback( async () => {
		if ( lowCredits ) {
			setActiveOnboarding( false );
			return false;
		}

		setUpdating( true );
		setNotification( 'onboarding-modules-step', { message: __( 'Saving data…' ), status: 'info' } );

		const response = await postFetch( `schedule/create`, userData.scheduleData );
		if ( response.ok ) {
			setNotification( 'onboarding-modules-step', { message: __( 'Data successfully saved!' ), status: 'success' } );
			setActiveOnboarding( false );
		} else {
			setNotification( 'onboarding-modules-step', { message: __( 'Data saving failed.' ), status: 'error' } );
		}

		setUpdating( false );
	}, [ lowCredits, userData.scheduleData, __, setActiveOnboarding ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper small-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Select modules' ) }</h1>
				<p className="heading-description">{ __( 'Select the ideal modules for your needs. We advise utilizing all of them to optimize the SEO and performance of your website to the fullest.' ) }</p>
			</div>

			<div className="urlslab-onboarding-content-settings">

				<div className="urlslab-onboarding-content-settings-modules">
					{ modules.map( ( module ) => {
						return (
							module.id !== 'general'
								? <DashboardModule
									key={ module.id }
									module={ module }
									isOnboardingItem
								/>
								: null
						);
					} )
					}
				</div>

				<div className="urlslab-onboarding-content-settings-footer flex flex-justify-end">
					<Button
						className="active"
						onClick={ () => submitData() }
						disabled={ updating }
					>
						<span>{ __( 'Finish and go to plugin' ) }</span>
						<ArrowIcon />
					</Button>
				</div>

			</div>
		</div>
	);
};

export default React.memo( StepModules );
