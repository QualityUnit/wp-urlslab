import { memo, useState, createContext } from 'react';
import { __ } from '@wordpress/i18n';

import useAIGeneratorManualInit from '../../../hooks/useAIGeneratorManualInit';

import StepFirst from './StepFirst';
import StepSecond from './StepSecond';
import StepThird from './StepThird';

import '../../../assets/styles/components/_ContentGeneratorPanel.scss';

export const ManualGeneratorContext = createContext( {} );

function ContentGeneratorManual( { initialData = {}, useEditor, onGenerateComplete, noPromptTemplate } ) {
	const [ currentStep, setCurrentStep ] = useState( 0 );
	const isQuestionAnsweringGenerator = initialData.mode === 'QUESTION_ANSWERING';
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
	const stepsComponents = [ StepFirst, StepSecond, StepThird ];

	if ( isQuestionAnsweringGenerator ) {
		steps.shift();
		stepsComponents.shift();
	}

	//handling the initial loading with preloaded data
	useAIGeneratorManualInit( { initialData } );

	return (
		<ManualGeneratorContext.Provider
			value={ {
				// passed from parent
				useEditor,
				onGenerateComplete,
				noPromptTemplate,
				isQuestionAnsweringGenerator,
				initialData,

				// internal data
				steps,
				currentStep,
				setCurrentStep,
			} }
		>
			{ stepsComponents.map( ( StepComponent, index ) => currentStep === index ? <StepComponent key={ index } /> : null ) }

		</ManualGeneratorContext.Provider>
	);
}

export default memo( ContentGeneratorManual );
