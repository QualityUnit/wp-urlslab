import { create } from 'zustand';

const useOnboardingStore = create( ( set ) => ( {
	version: 1,
	activeOnboarding: null, // keep temporary default value "null", allows us to recognize between loading and final known state when deciding if app or onboarding will be shown.
	steps: [
		{
			key: 'api_key',
			completed: false,
		},
		{
			key: 'schedule',
			completed: false,
		},
		{
			key: 'modules',
			completed: false,
		},
	],
	activeStep: 'api_key',
	modules: {},
	setActiveOnboarding: ( value ) => set( { activeOnboarding: value } ),
	setActiveStep: ( value ) => set( { activeStep: value } ),
	setModules: ( value ) => set( { modules: value } ),
	setNextStep: () => set( ( state ) => {
		let nextStep = state.activeStep;
		const index = state.steps.findIndex( ( node ) => node.key === state.activeStep );
		// check if we can move to the next step
		if ( index !== -1 && index + 1 < state.steps.length ) {
			nextStep = state.steps[ index + 1 ].key;
			state.steps[ index ].completed = true;
		}
		return { ...state, activeStep: nextStep };
	} ),
} ) );

export default function useOnboarding() {
	const activeOnboarding = useOnboardingStore( ( state ) => state.activeOnboarding );
	const steps = useOnboardingStore( ( state ) => state.steps );
	const activeStep = useOnboardingStore( ( state ) => state.activeStep );
	const modules = useOnboardingStore( ( state ) => state.modules );

	const setActiveOnboarding = useOnboardingStore( ( state ) => state.setActiveOnboarding );
	const setActiveStep = useOnboardingStore( ( state ) => state.setActiveStep );
	const setModules = useOnboardingStore( ( state ) => state.setModules );
	const setNextStep = useOnboardingStore( ( state ) => state.setNextStep );

	return { activeOnboarding, activeStep, steps, modules, setActiveOnboarding, setActiveStep, setModules, setNextStep };
}

