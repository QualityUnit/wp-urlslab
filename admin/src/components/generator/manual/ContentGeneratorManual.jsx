import { memo, useState, useContext, createContext, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';

import useAIGeneratorManualInit from '../../../hooks/useAIGeneratorManualInit';

import { ReactComponent as IconArrow } from '../../../assets/images/icons/icon-arrow.svg';

import StepFirst from './StepFirst';
import StepSecond from './StepSecond';
import StepThird from './StepThird';

import '../../../assets/styles/components/_ContentGeneratorPanel.scss';

export const ManualGeneratorContext = createContext( {} );

function ContentGeneratorManual( { initialData = {}, useEditor, onGenerateComplete, noPromptTemplate, closeBtn, isFloating } ) {
	const [ currentStep, setCurrentStep ] = useState( 0 );

	//handling the initial loading with preloaded data
	useAIGeneratorManualInit( { initialData } );

	return (
		<ManualGeneratorContext.Provider
			value={ {
				// passed from parent
				useEditor,
				onGenerateComplete,
				noPromptTemplate,
				closeBtn,
				isFloating,

				// internal data
				currentStep,
				setCurrentStep,
			} }
		>

			{ currentStep === 0 && <StepFirst /> }
			{ currentStep === 1 && <StepSecond /> }
			{ currentStep === 2 && <StepThird /> }

		</ManualGeneratorContext.Provider>
	);
}

export const NavigationButtons = ( { finishButton, disableBack, disableNext } ) => {
	const { __ } = useI18n();
	const { currentStep, setCurrentStep } = useContext( ManualGeneratorContext );

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

export default memo( ContentGeneratorManual );
