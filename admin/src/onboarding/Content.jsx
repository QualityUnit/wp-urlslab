import React, { useEffect, useMemo, useState } from 'react';

import useCheckApiKey from '../hooks/useCheckApiKey';
import useOnboarding from '../hooks/useOnboarding';
import useModulesQuery from '../queries/useModulesQuery';

import Loader from '../components/Loader';
import StepApiKey from './steps/StepApiKey';
import StepSchedule from './steps/StepSchedule';
import StepModules from './steps/StepModules';
import StepPlanChoice from './steps/StepPlanChoice';
import StepChooseKeywords from './steps/StepChooseKeywords';
import StepChooseCompetitors from './steps/StepChooseCompetitors';

const Content = () => {
	const { settingsLoaded } = useCheckApiKey();
	const { activeStep, setApiKey, userData, setAllActivateModulesData } = useOnboarding();

	// wait while we have loaded all necessary data
	const [ dataLoaded, setDataLoaded ] = useState( false );
	const { data: modules } = useModulesQuery();

	const apiSetting = useMemo( () => {
		return settingsLoaded?.filter( ( data ) => data.id === 'api' )?.[ 0 ];
	}, [ settingsLoaded ] );

	// set modules inactive by default
	useEffect( () => {
		if ( modules && Object.keys( modules ).length && ! Object.keys( userData.activateModulesData ).length ) {
			const filteredModules = Object.values( modules ).filter( ( module ) => module.id !== 'general' );
			const data = {};
			filteredModules.forEach( ( module ) => {
				data[ module.id ] = {
					id: module.id,
					active: false,
				};
			} );
			setAllActivateModulesData( data );
		}
	}, [ modules, userData.activateModulesData, setAllActivateModulesData ] );

	useEffect( () => {
		if ( modules && Object.values( modules ).length && apiSetting ) {
			//set initial api key value, if onboarding is forced to show in future again
			setApiKey( apiSetting.options[ 'urlslab-api-key' ].value );
			setDataLoaded( true );
		}
	}, [ modules, apiSetting, setApiKey ] );

	return (
		<div className="urlslab-onboarding-content">
			{ dataLoaded
				? <>
					{ activeStep === 'plan_choice' && <StepPlanChoice /> }
					{ activeStep === 'api_key' && <StepApiKey apiSetting={ apiSetting } /> }
					{ activeStep === 'schedule' && <StepSchedule /> }
					{ activeStep === 'choose_keywords' && <StepChooseKeywords /> }
					{ activeStep === 'choose_competitors' && <StepChooseCompetitors /> }
					{ activeStep === 'modules' && <StepModules /> }
				</>
				: <Loader />
			}
		</div>
	);
};

export default React.memo( Content );
