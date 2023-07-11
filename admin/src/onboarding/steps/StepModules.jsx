import { useI18n } from '@wordpress/react-i18n';
import { ReactComponent as ArrowIcon } from '../../assets/images/icons/icon-arrow.svg';

import Button from '../../elements/Button';
import useOnboarding from '../../hooks/useOnboarding';
import DashboardModule from '../../components/DashboardModule';

const StepModules = ( { modules } ) => {
	const { __ } = useI18n();
	const { activeStep, setActiveOnboarding } = useOnboarding();

	return (
		<div className={ `urlslab-onboarding-content-wrapper small-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Select modules' ) }</h1>
				<p className="heading-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
			</div>

			<div className="urlslab-onboarding-content-settings">

				<div className="urlslab-onboarding-content-settings-modules">
					{ modules.map( ( module ) => {
						const { id, active, title, description } = module;
						return (
							module.id !== 'general'
								? <DashboardModule
									key={ id }
									moduleId={ id }
									isActive={ active }
									title={ title }
									isOnboardingItem
								>
									{ description }
								</DashboardModule>
								: null
						);
					} )
					}
				</div>

				<div className="urlslab-onboarding-content-settings-footer flex flex-justify-end">
					<Button
						className="active icon-right"
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

export default StepModules;
