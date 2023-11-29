import React, { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import useOnboarding from '../../hooks/useOnboarding';

import SvgIcon from '../../elements/SvgIcon';
import Stack from '@mui/joy/Stack';
import { ColumnWrapper, UrlOption } from '../../elements/UrlOption';

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
		<div className={ `urlslab-onboarding-content-wrapper large-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Choose the keywords you want to rank for' ) }</h1>
				<p className="heading-description">
					{ __( 'Give more insight to URLsLab plugin on keywords you want your website to rank for. This will help the plugin to get you started with SEO Insights module' ) }
				</p>
			</div>

			<div className="urlslab-onboarding-content-settings">
				<Stack direction="row" flexWrap="wrap">

					{ userKeywords.length > 0 &&
						<>
							{
								userKeywords.map( ( [ key, keyword ] ) => (
									<UrlOption key={ key } index={ key } url={ keyword } />
								) )
							}
						</>
					}
					<ColumnWrapper>
						<Button
							color="neutral"
							variant="soft"
							onClick={ addNewInput }
							startDecorator={ <SvgIcon name="plus" /> }
							sx={ ( theme ) => ( {
								width: '100%',
								'--Icon-fontSize': theme.vars.fontSize.sm,
							} ) }
						>
							{ __( 'Add another keyword' ) }
						</Button>
					</ColumnWrapper>
				</Stack>
			</div>
		</div>
	);
};

export default React.memo( StepPlanChoice );
