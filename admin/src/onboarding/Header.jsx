import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useI18n } from '@wordpress/react-i18n';

import useOnboarding from '../hooks/useOnboarding';
import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';

const Header = () => {
	const { __ } = useI18n();
	const { steps, activeStep } = useOnboarding();

	const labels = useMemo( () => {
		return {
			api_key: __( 'Add your API Key' ),
			schedule: __( 'Add schedule' ),
			modules: __( 'Activate modules' ),
		};
	}, [ __ ] );

	return (
		<div className="urlslab-onboarding-header flex flex-align-center flex-justify-center pos-relative">
			<Logo className="urlslab-onboarding-header-logo pos-absolute" />
			<div className="urlslab-onboarding-header-steps flex flex-align-center">
				{ steps.map( ( step, index ) =>
					<HeaderStep
						key={ step.key }
						label={ labels[ step.key ] }
						index={ index }
						active={ step.key === activeStep }
						completed={ step.completed }
					/>
				) }
			</div>
		</div>
	);
};

const HeaderStep = React.memo( ( { label, index, active, completed } ) => {
	return (
		<div
			className={ classNames( [
				'step-item flex flex-align-center',
				active ? 'state-active' : null,
				completed && ! active ? 'state-completed' : null,
			] ) }
		>
			<div className="step-item-icon flex flex-align-center flex-justify-center">{ `0${ index + 1 }` }</div>
			<div className="step-item-label">{ label }</div>
		</div>
	);
} );

export default React.memo( Header );

