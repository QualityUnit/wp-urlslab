import { memo, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';

import { ReactComponent as IconArrow } from '../assets/images/icons/icon-arrow.svg';

const StepNavigation = ( { finishButton, disableBack, disableNext, stepData } ) => {
	const { __ } = useI18n();
	const { currentStep, setCurrentStep } = stepData;

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
				{ ( currentStep > 0 ) && <Button variant="soft" color="neutral" disabled={ disableBack === true } onClick={ stepBack }>{ __( 'Go back' ) }</Button> }
				{ finishButton ? finishButton : <Button endDecorator={ <IconArrow /> } disabled={ disableNext === true } onClick={ stepNext }>{ __( 'Next' ) }</Button> }
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
				justifyContent={ steps.length > 2 ? 'space-between' : 'center' }
				alignItems="center"
				spacing={ 2 }
				sx={ { mt: 2, mb: 2 } }
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
			<Divider />
		</Box>
	);
} );

export default memo( StepNavigation );
