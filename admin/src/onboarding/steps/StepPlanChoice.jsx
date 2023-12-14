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
	__( 'Link Building' ),
	__( 'Related Articles in manual mode' ),
	__( 'FAQs in manual mode' ),
	__( 'Redirects' ),
	__( 'Web Vitals' ),
	__( 'Cache and other performance optimisations' ),
	__( 'and many more…' ),

];

const premiumFeatures = [
	__( 'All free features' ),
	__( 'Domain scheduling' ),
	__( 'Monitoring of website changes' ),
	__( 'AI Content' ),
	__( 'SEO Insight' ),
	__( 'Automated Related Articles' ),
	__( 'Automated FAQs' ),
];

const StepPlanChoice = () => {
	const { activeStep, setNextStep, setChosenPlan } = useOnboarding();

	return (
		<div className={ `urlslab-onboarding-content-wrapper large-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Let\'s get started' ) }</h1>
				<p className="heading-description">
					{ __( 'You can choose either to use the free plan and use limited features or to try the premium plan with 5$ free credit.' ) }
				</p>
			</div>

			<div className="urlslab-onboarding-content-settings">
				<Grid container spacing={ 2 } sx={ { flexGrow: 1 } }>
					<Grid xs={ 12 } md={ 6 }>
						<Stack className="plans-container">
							<SvgIcon name="lab1" />
							<h3 className="plans-container-title">
								{ __( 'Free' ) }
							</h3>
							<p className="plans-conatiner-desc">
								{ __( 'Free plan has limited features. The features in Free URLsLab plugin include:' ) }
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
								{ __( 'Get Started' ) }
							</Button>
						</Stack>
					</Grid>
					<Grid xs={ 12 } md={ 6 }>
						<Stack className="plans-container active">
							<SvgIcon name="lab2" />
							<h3 className="plans-container-title">
								{ __( 'Try Premium' ) }
							</h3>
							<p className="plans-conatiner-desc">
								{ __( 'Unlock all features of URLsLab plugin by logging in. The features in Premium include:' ) }
							</p>
							<List className="plans-container-feature-list" variant="outlined">
								{ premiumFeatures.map( ( feature, index ) => (
									<ListItem key={ index }>
										{ feature }
									</ListItem>
								) ) }
							</List>
							<Stack sx={ { mt: 2 } }>
								<Typography component="p" color="neutral" level="body-sm" textAlign="center" marginY={ 1 }>{ __( 'No credit card required' ) }</Typography>
							</Stack>
							<Button
								color="primary"
								onClick={ () => {
									setChosenPlan( 'premium' );
									setNextStep();
								} }
							>
								{ __( 'Get $5 credits for free' ) }
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default React.memo( StepPlanChoice );
