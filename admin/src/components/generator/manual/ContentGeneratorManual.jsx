import { memo, useState, createContext } from 'react';

import useAIGeneratorManualInit from '../../../hooks/useAIGeneratorManualInit';

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

export default memo( ContentGeneratorManual );
