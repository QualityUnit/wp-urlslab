import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useI18n } from '@wordpress/react-i18n';

import useOnboarding, { stepStatus } from '../hooks/useOnboarding';
import Credits from '../components/Credits';
import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';

const Header = () => {
	const { __ } = useI18n();
	const { steps, activeStep, userData } = useOnboarding();

	const labels = useMemo( () => {
		return {
			plan_choice: __( 'Get Started', 'urlslab' ),
			api_key: __( 'Add your API key', 'urlslab' ),
			schedule: __( 'Add your domain', 'urlslab' ),
			choose_keywords: __( 'Choose search query', 'urlslab' ),
			choose_competitors: __( 'Choose competitors', 'urlslab' ),
			modules: __( 'Activate modules', 'urlslab' ),
		};
	}, [ __ ] );

	return (
		<div className="urlslab-onboarding-header flex flex-align-center flex-justify-space-between pos-relative mb-xxl">
			<Logo className="urlslab-onboarding-header-logo" />
			<div className="urlslab-onboarding-header-steps">
				{ steps.map( ( step, index ) =>
					<HeaderStep
						key={ step.key }
						stepId={ step.key }
						label={ labels[ step.key ] }
						index={ index }
						active={ step.key === activeStep }
						status={ step.status }
					/>
				) }
			</div>
			{ userData.apiKey &&
				<div className="urlslab-onboarding-header-credits">
					<Credits />
				</div>
			}
		</div>
	);
};

const HeaderStep = React.memo( ( { stepId, label, index, active, status } ) => {
	const { setActiveStep } = useOnboarding();
	return (
		<div
			className={ classNames( [
				'step-item flex flex-align-center',
				active ? 'state-active' : null,
				status === stepStatus.COMPLETED && ! active ? 'state-completed' : null,
				status === stepStatus.JUMPED && ! active ? 'state-skipped' : null,
			] ) }
			onKeyUp={ null }
			onClick={ status === stepStatus.COMPLETED && ! active
				? () => {
					setActiveStep( stepId );
				}
				: null
			}
		>
			<div className="step-item-icon flex flex-align-center flex-justify-center fs-normal">{ `0${ index + 1 }` }</div>
			<div className="step-item-label fs-xm">{ label }</div>
		</div>
	);
} );

export default Header;
