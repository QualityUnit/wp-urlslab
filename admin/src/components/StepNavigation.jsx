import { memo, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { Link } from 'react-router-dom';

import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';

import SvgIcon from '../elements/SvgIcon';

const StepNavigation = ( { finishButton, disableBack, disableNext, stepData } ) => {
	const { __ } = useI18n();
	const { currentStep, setCurrentStep, aiGeneratorConfig } = stepData;

	const stepNext = useCallback( () => {
		setCurrentStep( ( s ) => s + 1 );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	const stepBack = useCallback( () => {
		setCurrentStep( ( s ) => s > 0 ? s - 1 : s );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	return (
		<Box>
			<Divider sx={ ( theme ) => ( {
				marginY: theme.spacing( 2 ),
			} ) } />
			<Stack
				direction="row"
				justifyContent="end"
				alignItems="center"
				spacing={ 1 }
			>
				{ ( aiGeneratorConfig?.dataSource === 'SERP_CONTEXT' && currentStep === 0 ) &&
					<Button variant="soft" color="neutral"
						component={ Link }
						to="/Serp/serp-queries">
						{ __( 'Back to Queries', 'urlslab' ) }
					</Button>
				}
				{ ( currentStep > 0 ) && <Button variant="soft" color="neutral" disabled={ disableBack === true } onClick={ stepBack }>{ __( 'Go back', 'urlslab' ) }</Button> }
				{ finishButton ? finishButton : <Button endDecorator={ <SvgIcon name="arrow" /> } disabled={ disableNext === true } onClick={ stepNext }>{ __( 'Next', 'urlslab' ) }</Button> }
			</Stack>
		</Box>
	);
};

export const StepNavigationHeader = memo( ( { disableBack, disableNext, stepData, steps } ) => {
	const { currentStep, setCurrentStep } = stepData;

	const stepNext = useCallback( () => {
		setCurrentStep( ( s ) => s + 1 );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	const stepBack = useCallback( ( step ) => {
		// alow to go back to any previous step
		if ( step !== undefined ) {
			setCurrentStep( step );
			return;
		}
		setCurrentStep( ( s ) => s > 0 ? s - 1 : s );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	return (
		<Box>
			<Stack
				direction="row"
				justifyContent="center"
				alignItems="center"
				spacing={ 2 }
				sx={ { marginY: 2 } }
			>
				{ steps.map( ( step, index ) => {
					const activeStep = index === currentStep;
					const activeNextStep = index === currentStep + 1 && ! disableNext;
					const activePreviousStep = index < currentStep && ! disableBack;
					const finishedStep = index < currentStep;

					let color = 'neutral';
					if ( activeStep || activeNextStep ) {
						color = 'primary';
					} else if ( finishedStep ) {
						color = 'success';
					}

					const variant = ! activeStep && ! finishedStep ? 'outlined' : 'soft';

					let onClick = null;
					if ( activeNextStep ) {
						onClick = stepNext;
					}
					if ( activePreviousStep ) {
						onClick = () => stepBack( index );
					}

					return <Stack
						key={ `${ step.title }-${ index }` }
						direction="row"
						alignItems="center"
						spacing={ 1 }
						onClick={ onClick }
						sx={ {
							cursor: onClick === null ? 'default' : 'pointer',
							opacity: activeStep || finishedStep ? 1 : 0.5,
							':hover': {
								opacity: activeStep || finishedStep || activeNextStep ? 1 : 0.5,
							},
						} }
					>
						<Avatar variant={ variant } color={ color }>{ `0${ index + 1 }` }</Avatar>
						<Typography
							level="body-sm"
							color={ color }
							sx={ {
								...( activeStep && { fontWeight: 500 } ),
							} }
						>
							{ step.title }
						</Typography>
					</Stack>;
				} ) }

			</Stack>
		</Box>
	);
} );

export default memo( StepNavigation );
