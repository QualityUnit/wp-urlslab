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
import useTablePanels from '../../hooks/useTablePanels';

const StepPlanChoice = () => {
	const { __ } = useI18n();
	const { activeStep, setNextStep, userData, setApiKey } = useOnboarding();

	return (
		<div className={ `urlslab-onboarding-content-wrapper large-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Let\'s get started' ) }</h1>
				<p className="heading-description">
					{ __( 'You can choose either to use the free plan and use limited features or to try the premium plan with 5$ free credit.' ) }
				</p>
			</div>

			<div className="urlslab-onboarding-content-settings"></div>
		</div>
	);
};

export default React.memo( StepPlanChoice );
