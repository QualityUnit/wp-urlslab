import React from 'react';
import { __ } from '@wordpress/i18n';

import Button from '@mui/joy/Button';

import useOnboarding from '../../hooks/useOnboarding';

import SvgIcon from '../../elements/SvgIcon';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import ListItem from '@mui/joy/ListItem';
import List from '@mui/joy/List';

const freeFeatures = [
	__( 'Link Building', 'urlslab' ),
	__( 'Related Articles in manual mode', 'urlslab' ),
	__( 'FAQs in manual mode', 'urlslab' ),
	__( 'Redirects', 'urlslab' ),
	__( 'Web Vitals', 'urlslab' ),
	__( 'Cache and other performance optimisations', 'urlslab' ),
	__( 'and many more…', 'urlslab' ),

];

const premiumFeatures = [
	__( 'All free features', 'urlslab' ),
	__( 'Domain scheduling', 'urlslab' ),
	__( 'Monitoring of website changes', 'urlslab' ),
	__( 'AI Content', 'urlslab' ),
	__( 'SEO Insight', 'urlslab' ),
	__( 'Automated Related Articles', 'urlslab' ),
	__( 'Automated FAQs', 'urlslab' ),
];

const StepPlanChoice = () => {
	const { activeStep, setNextStep, setChosenPlan } = useOnboarding();

	return (
		<div className={ `urlslab-onboarding-content-wrapper large-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Let\'s get started', 'urlslab' ) }</h1>
				<p className="heading-description">
					{ __( 'You can choose either to use the free plan and use limited features or to try the premium plan with 5$ free credit.', 'urlslab' ) }
				</p>
			</div>

			<div className="urlslab-onboarding-content-settings">
				<Grid container spacing={ 2 } sx={ { flexGrow: 1 } }>
					<Grid xs={ 12 } md={ 6 }>
						<Stack className="plans-container">
							<SvgIcon name="lab1" />
							<h3 className="plans-container-title">
								{ __( 'Free', 'urlslab' ) }
							</h3>
							<p className="plans-conatiner-desc">
								{ __( 'Free plan has limited features. The features in Free URLsLab plugin include:', 'urlslab' ) }
							</p>
							<List className="plans-container-feature-list" variant="outlined">
								{ freeFeatures.map( ( feature, index ) => (
									<ListItem key={ index }>
										{ feature }
									</ListItem>
								) ) }
							</List>
							<Button
								sx={ { mt: 2 } }
								color="primary"
								variant="outlined"
								onClick={ () => {
									setChosenPlan( 'free' );
									setNextStep( true );
								} }
							>
								{ __( 'Get Started', 'urlslab' ) }
							</Button>
						</Stack>
					</Grid>
					<Grid xs={ 12 } md={ 6 }>
						<Stack className="plans-container active">
							<SvgIcon name="lab2" />
							<h3 className="plans-container-title">
								{ __( 'Try Premium', 'urlslab' ) }
							</h3>
							<p className="plans-conatiner-desc">
								{ __( 'Unlock all features of URLsLab plugin by logging in. The features in Premium include:', 'urlslab' ) }
							</p>
							<List className="plans-container-feature-list" variant="outlined">
								{ premiumFeatures.map( ( feature, index ) => (
									<ListItem key={ index }>
										{ feature }
									</ListItem>
								) ) }
							</List>
							<Stack sx={ { mt: 2 } }>
								<Typography component="p" color="neutral" level="body-sm" textAlign="center" marginY={ 1 }>{ __( 'No credit card required', 'urlslab' ) }</Typography>
							</Stack>
							<Button
								color="primary"
								onClick={ () => {
									setChosenPlan( 'premium' );
									setNextStep();
								} }
							>
								{ __( 'Get $5 credits for free', 'urlslab' ) }
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default React.memo( StepPlanChoice );
