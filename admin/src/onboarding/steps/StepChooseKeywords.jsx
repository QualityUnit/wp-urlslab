import React, { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import useOnboarding from '../../hooks/useOnboarding';

import SvgIcon from '../../elements/SvgIcon';
import Stack from '@mui/joy/Stack';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import FormHelperText from '@mui/joy/FormHelperText';
import FormControl from '@mui/joy/FormControl';

const StepPlanChoice = () => {
	const { __ } = useI18n();
	const { activeStep, setNextStep, userData } = useOnboarding();
	const [ userKeywords, setUserKeywords ] = useState( userData.keywords );

	const addNewInput = ( newKeyword ) => {
		if ( newKeyword ) {
			setUserKeywords( [ ...userKeywords, newKeyword ] );
		}
	};

	return (
		<div className={ `urlslab-onboarding-content-wrapper small-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Choose the keywords you want to rank for' ) }</h1>
				<p className="heading-description">
					{ __( 'Give more insight to URLsLab plugin on keywords you want your website to rank for. This will help the plugin to get you started with SEO Insights module' ) }
				</p>
			</div>

			<div className="urlslab-onboarding-content-settings">
				<Stack direction="row" flexWrap="wrap">

					<FormControl sx={ { width: '100%' } } required >
						<FormLabel>{ __( 'Keyword' ) }</FormLabel>
						<Input
							defaultValue={ userKeywords }
							onChange={ ( event ) => setUserKeywords( event.target.value ) }
						/>
					</FormControl>

					<div className="urlslab-onboarding-content-settings-footer flex flex-align-center flex-justify-end">
						<Button
							onClick={ () => {} }
							disabled={ ! userKeywords || userKeywords.length === 0 ? true : undefined }
							endDecorator={ <SvgIcon name="arrow" /> }
						>
							{ __( 'Apply and next' ) }
						</Button>
					</div>
				</Stack>
			</div>
		</div>
	);
};

export default React.memo( StepPlanChoice );
