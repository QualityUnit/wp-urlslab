import React, { useEffect, useMemo, useState } from 'react';

import useCheckApiKey from '../hooks/useCheckApiKey';
import useOnboarding from '../hooks/useOnboarding';
import useModulesQuery from '../queries/useModulesQuery';

import Loader from '../components/Loader';
import StepApiKey from './steps/StepApiKey';
import StepSchedule from './steps/StepSchedule';
import StepModules from './steps/StepModules';

const Content = () => {
	const { settingsLoaded } = useCheckApiKey();
	const { activeStep, setApiKey } = useOnboarding();

	// wait while we have loaded all necessary data
	const [ dataLoaded, setDataLoaded ] = useState( false );
	const { data: modules } = useModulesQuery();

	const apiSetting = useMemo( () => {
		return settingsLoaded?.filter( ( data ) => data.id === 'api' )?.[ 0 ];
	}, [ settingsLoaded ] );

	useEffect( () => {
		if ( modules && apiSetting ) {
			//set initial api key value, if onboarding is forced to show in future again
			setApiKey( apiSetting.options[ 'urlslab-api-key' ].value );
			setDataLoaded( true );
		}
	}, [ modules, apiSetting, setApiKey ] );

	return (
		<div className="urlslab-onboarding-content">
			{ dataLoaded
				? <>
					{ activeStep === 'api_key' && <StepApiKey apiSetting={ apiSetting } /> }
					{ activeStep === 'schedule' && <StepSchedule /> }
					{ activeStep === 'modules' && <StepModules modules={ Object.values( modules ) } /> }
				</>
				: <Loader />
			}
		</div>
	);
};

export default React.memo( Content );
