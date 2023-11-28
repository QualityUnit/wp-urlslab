import React from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

import useOnboarding from '../../hooks/useOnboarding';
import InputField from '../../elements/InputField';

import SvgIcon from '../../elements/SvgIcon';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import { __ } from '@wordpress/i18n';
import Typography from '@mui/joy/Typography';
import ListItem from '@mui/joy/ListItem';
import { ListItemButton } from '@mui/joy';
import List from '@mui/joy/List';

const StepPlanChoice = () => {
	const { __ } = useI18n();
	const { activeStep, setNextStep, userData, setApiKey } = useOnboarding();

	const freeFeatures = [
		__( 'Link Building' ),
		__( 'Cache' ),
		__( 'Media management' ),
		__( 'Search And Replace' ),
		__( 'Code Injection' ),
		__( 'Redirects' ),
		__( 'Lazy Loading' ),
		__( 'Database Optimisation' ),
		__( 'Web Vitals' ),
		__( 'URLs' ),
	];

	const premiumFeatures = [
		__( 'All free features' ),
		__( 'Domain Scheduling' ),
		__( 'Domain Changes' ),
		__( 'AI Content' ),
		__( 'SEO Insight' ),
		__( 'Related Articles' ),
		__( 'FAQs' ),
	];

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
						</Stack>
					</Grid>
					<Grid xs={ 12 } md={ 6 }>
						<Stack className="plans-container">
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
						</Stack>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default React.memo( StepPlanChoice );
