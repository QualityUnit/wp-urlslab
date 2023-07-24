import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useI18n } from '@wordpress/react-i18n';

import useOnboarding from '../hooks/useOnboarding';
import Credits from '../components/Credits';
import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';

const Header = () => {
	const { __ } = useI18n();
	const { steps, activeStep, userData } = useOnboarding();

	const labels = useMemo( () => {
		return {
			api_key: __( 'Add your API Key' ),
			schedule: __( 'Add schedule' ),
			modules: __( 'Activate modules' ),
		};
	}, [ __ ] );

	return (
		<div className="urlslab-onboarding-header flex flex-align-center flex-justify-center pos-relative mb-xxl">
			<Logo className="urlslab-onboarding-header-logo pos-absolute" />
			<div className="urlslab-onboarding-header-steps flex flex-align-center">
				{ steps.map( ( step, index ) =>
					<HeaderStep
						key={ step.key }
						stepId={ step.key }
						label={ labels[ step.key ] }
						index={ index }
						active={ step.key === activeStep }
						completed={ step.completed }
					/>
				) }
			</div>
			{ userData.apiKey &&
				<div className="urlslab-onboarding-header-credits pos-absolute">
					<Credits />
				</div>
			}
		</div>
	);
};

const HeaderStep = React.memo( ( { stepId, label, index, active, completed } ) => {
	const { setActiveStep } = useOnboarding();
	return (
		<div
			className={ classNames( [
				'step-item flex flex-align-center',
				active ? 'state-active' : null,
				completed && ! active ? 'state-completed' : null,
			] ) }
			onKeyUp={ null }
			onClick={ completed && ! active
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

