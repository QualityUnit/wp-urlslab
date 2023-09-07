import { memo, useState, useContext, createContext, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';

import { ReactComponent as IconArrow } from '../../../assets/images/icons/icon-arrow.svg';
import StepFirst from './StepFirst';
import StepSecond from './StepSecond';
import useAIGeneratorScalableInit from '../../../hooks/useAIGeneratorScalableInit';

export const ScalableGeneratorContext = createContext( {} );

function ContentGeneratorScalable( { isFloating } ) {
	const [ currentStep, setCurrentStep ] = useState( 0 );

	useAIGeneratorScalableInit();

	return (
		<ScalableGeneratorContext.Provider
			value={ {
				// passed from parent
				isFloating,

				// internal data
				currentStep,
				setCurrentStep,
			} }
		>

			{ currentStep === 0 && <StepFirst /> }
			{ currentStep === 1 && <StepSecond /> }

		</ScalableGeneratorContext.Provider>
	);
}

export const NavigationButtons = ( { finishButton, disableBack, disableNext } ) => {
	const { __ } = useI18n();
	const { currentStep, setCurrentStep } = useContext( ScalableGeneratorContext );

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
				justifyContent={ 'end' }
				alignItems="center"
				spacing={ 1 }
			>
				{ ( currentStep > 0 ) && <Button variant="soft" color="neutral" disabled={ disableBack === true } onClick={ stepBack }>{ __( 'Go back' ) }</Button> }
				{ finishButton ? finishButton : <Button endDecorator={ <IconArrow /> } disabled={ disableNext === true } onClick={ stepNext }>{ __( 'Next' ) }</Button> }
			</Stack>
		</Box>
	);
};

export default memo( ContentGeneratorScalable );
