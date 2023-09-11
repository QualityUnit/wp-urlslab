import { memo, useState, createContext } from 'react';
import { __ } from '@wordpress/i18n';

import useAIGeneratorManualInit from '../../../hooks/useAIGeneratorManualInit';

import StepFirst from './StepFirst';
import StepSecond from './StepSecond';
import StepThird from './StepThird';

import '../../../assets/styles/components/_ContentGeneratorPanel.scss';

export const ManualGeneratorContext = createContext( {} );

const steps = [
	{
		title: __( 'Page title & keywords' ),
	},
	{
		title: __( 'Data source & langauge' ),
	},
	{
		title: __( 'Generate content' ),
	},
];

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
				steps,
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

export default memo( ContentGeneratorManual );
