import { memo, useState, createContext } from 'react';
import { __ } from '@wordpress/i18n';

import useAIGeneratorScalableInit from '../../../hooks/useAIGeneratorScalableInit';

import StepFirst from './StepFirst';
import StepSecond from './StepSecond';

export const ScalableGeneratorContext = createContext( {} );

const steps = [
	{
		title: __( 'Keywords import' ),
	},
	{
		title: __( 'Generate content' ),
	},
];

function ContentGeneratorScalable( { isFloating } ) {
	const [ currentStep, setCurrentStep ] = useState( 0 );

	useAIGeneratorScalableInit();

	return (
		<ScalableGeneratorContext.Provider
			value={ {
				// passed from parent
				isFloating,

				// internal data
				steps,
				currentStep,
				setCurrentStep,
			} }
		>

			{ currentStep === 0 && <StepFirst /> }
			{ currentStep === 1 && <StepSecond /> }

		</ScalableGeneratorContext.Provider>
	);
}

export default memo( ContentGeneratorScalable );
