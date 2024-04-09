import { memo, useState, createContext } from 'react';
import { __ } from '@wordpress/i18n';

import useAIGeneratorScalableInit from '../../../hooks/useAIGeneratorScalableInit';

import StepFirst from './StepFirst';
import StepSecond from './StepSecond';

export const ScalableGeneratorContext = createContext( {} );

const steps = [
	{
		title: __( 'Keywords import', 'urlslab' ),
	},
	{
		title: __( 'Generate content', 'urlslab' ),
	},
];

function ContentGeneratorScalable() {
	const [ currentStep, setCurrentStep ] = useState( 0 );

	useAIGeneratorScalableInit();

	return (
		<ScalableGeneratorContext.Provider
			value={ {
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
