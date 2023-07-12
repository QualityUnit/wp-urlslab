import React from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useOnboarding from '../../hooks/useOnboarding';
import DashboardModule from '../../components/DashboardModule';
import Button from '../../elements/Button';

import { ReactComponent as ArrowIcon } from '../../assets/images/icons/icon-arrow.svg';

const StepModules = ( { modules } ) => {
	const { __ } = useI18n();
	const { activeStep, setActiveOnboarding } = useOnboarding();

	return (
		<div className={ `urlslab-onboarding-content-wrapper small-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Select modules' ) }</h1>
				<p className="heading-description">Select the ideal modules for your needs. We advise utilizing all of them to optimize the SEO and performance of your website to the fullest.</p>
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
						onClick={ () => setActiveOnboarding( false ) }
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
