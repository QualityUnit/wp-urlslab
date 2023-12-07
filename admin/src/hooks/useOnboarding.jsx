import { create } from 'zustand';

export const stepStatus = {
	NOT_STARTED: 'NOT_STARTED',
	JUMPED: 'JUMPED',
	COMPLETED: 'COMPLETED',
};

const useOnboardingStore = create( ( set ) => ( {
	activeStep: 'plan_choice',
	steps: [
		{
			key: 'plan_choice',
			status: stepStatus.NOT_STARTED,
		},
		{
			key: 'api_key',
			status: stepStatus.NOT_STARTED,
		},
		{
			key: 'schedule',
			status: stepStatus.NOT_STARTED,
		},
		{
			key: 'choose_keywords',
			status: stepStatus.NOT_STARTED,
		},
		{
			key: 'choose_competitors',
			status: stepStatus.NOT_STARTED,
		},
		{
			key: 'modules',
			status: stepStatus.NOT_STARTED,
		},
	],
	userData: {
		apiKey: '',
		chosenPlan: '',
		scheduleData: {
			urls: document.location.origin,
			analyze_text: '1',
			follow_links: 'FOLLOW_ALL_LINKS',
			process_all_sitemaps: '1',
			scan_frequency: 'MONTHLY',
			scan_speed_per_minute: 20,
			take_screenshot: '1',
			custom_sitemaps: '',
		},
		keywords: [],
		activateModulesData: {},
	},
	setActiveStep: ( value ) => set( ( state ) => {
		// if first step is chose, all jump statuses should be reset
		if ( value === 'plan_choice' ) {
			state.steps.forEach( ( s ) => {
				if ( s.status === stepStatus.JUMPED ) {
					s.status = stepStatus.NOT_STARTED;
				}
			} );
		}

		return { ...state, activeStep: value };
	} ),
	setNextStep: ( jumpToLastStep = false ) => set( ( state ) => {
		let nextStep = state.activeStep;
		const index = state.steps.findIndex( ( node ) => node.key === state.activeStep );
		// check if we can move to the next step
		if ( jumpToLastStep ) {
			// mark all steps as completed except the last one
			state.steps.forEach( ( s, i ) => {
				if ( i === 0 ) {
					s.status = stepStatus.COMPLETED;
				} else if ( i !== state.steps.length - 1 ) {
					s.status = stepStatus.JUMPED;
				}
			} );
			nextStep = state.steps[ state.steps.length - 1 ].key;
		} else if ( index !== -1 && index + 1 < state.steps.length ) {
			nextStep = state.steps[ index + 1 ].key;
			state.steps[ index ].status = stepStatus.COMPLETED;
		}
		return { ...state, activeStep: nextStep };
	} ),
	setChosenPlan: ( value ) => set( ( state ) => {
		return { ...state, userData: { ...state.userData, chosenPlan: value } };
	} ),
	setScheduleData: ( value ) => set( ( state ) => {
		return { ...state, userData: { ...state.userData, scheduleData: value } };
	} ),
	setKeywords: ( value ) => set( ( state ) => {
		return { ...state, userData: { ...state.userData, keywords: value } };
	} ),
	setApiKey: ( value ) => set( ( state ) => {
		return { ...state, userData: { ...state.userData, apiKey: value } };
	} ),
	setActivateModulesData: ( id, active ) => set( ( state ) => {
		return { ...state, userData: { ...state.userData, activateModulesData: { ...state.userData.activateModulesData, [ id ]: { id, active } } } };
	} ),
	setDefaultActivateModulesData: ( value ) => set( ( state ) => {
		return { ...state, userData: { ...state.userData, activateModulesData: value } };
	} ),

} ) );

export default function useOnboarding() {
	const steps = useOnboardingStore( ( state ) => state.steps );
	const activeStep = useOnboardingStore( ( state ) => state.activeStep );
	const userData = useOnboardingStore( ( state ) => state.userData );

	const setNextStep = useOnboardingStore( ( state ) => state.setNextStep );
	const setChosenPlan = useOnboardingStore( ( state ) => state.setChosenPlan );
	const setActiveStep = useOnboardingStore( ( state ) => state.setActiveStep );
	const setScheduleData = useOnboardingStore( ( state ) => state.setScheduleData );
	const setKeywords = useOnboardingStore( ( state ) => state.setKeywords );
	const setApiKey = useOnboardingStore( ( state ) => state.setApiKey );
	const setActivateModulesData = useOnboardingStore( ( state ) => state.setActivateModulesData );
	const setDefaultActivateModulesData = useOnboardingStore( ( state ) => state.setDefaultActivateModulesData );

	return {
		activeStep,
		steps,
		userData,

		setNextStep,
		setChosenPlan,
		setActiveStep,
		setScheduleData,
		setKeywords,
		setApiKey,
		setActivateModulesData,
		setDefaultActivateModulesData,
	};
}
