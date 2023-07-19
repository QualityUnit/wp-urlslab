import { create } from 'zustand';

const useOnboardingStore = create( ( set ) => ( {
	activeOnboarding: true,
	activeStep: 'api_key',
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
	userData: {
		apiKey: '',
		scheduleData: {
			urls: document.location.origin,
			analyze_text: '1',
			follow_links: 'FOLLOW_NO_LINK',
			process_all_sitemaps: '1',
			scan_frequency: 'MONTHLY',
			scan_speed_per_minute: 20,
			take_screenshot: '1',
			custom_sitemaps: '',
		},
	},
	setActiveOnboarding: ( value ) => set( { activeOnboarding: value } ),
	setActiveStep: ( value ) => set( { activeStep: value } ),
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
	setScheduleData: ( value ) => set( ( state ) => {
		return { ...state, userData: { ...state.userData, scheduleData: value } };
	} ),
	setApiKey: ( value ) => set( ( state ) => {
		return { ...state, userData: { ...state.userData, apiKey: value } };
	} ),
} ) );

export default function useOnboarding() {
	const activeOnboarding = useOnboardingStore( ( state ) => state.activeOnboarding );
	const steps = useOnboardingStore( ( state ) => state.steps );
	const activeStep = useOnboardingStore( ( state ) => state.activeStep );
	const userData = useOnboardingStore( ( state ) => state.userData );

	const setActiveOnboarding = useOnboardingStore( ( state ) => state.setActiveOnboarding );
	const setNextStep = useOnboardingStore( ( state ) => state.setNextStep );
	const setActiveStep = useOnboardingStore( ( state ) => state.setActiveStep );
	const setScheduleData = useOnboardingStore( ( state ) => state.setScheduleData );
	const setApiKey = useOnboardingStore( ( state ) => state.setApiKey );

	return {
		activeOnboarding,
		activeStep,
		steps,
		userData,
		setActiveOnboarding,
		setNextStep,
		setActiveStep,
		setScheduleData,
		setApiKey,
	};
}
