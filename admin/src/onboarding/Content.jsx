import React, { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import useCheckApiKey from '../hooks/useCheckApiKey';
import useOnboarding from '../hooks/useOnboarding';

import Loader from '../components/Loader';
import StepApiKey from './steps/StepApiKey';
import StepSchedule from './steps/StepSchedule';
import StepModules from './steps/StepModules';

const Content = () => {
	const queryClient = useQueryClient();
	const { settingsLoaded } = useCheckApiKey();
	const { activeStep } = useOnboarding();

	// wait while we have loaded all necessary data
	const [ dataLoaded, setDataLoaded ] = useState( false );

	const modules = queryClient.getQueryData( [ 'modules' ] );
	const apiSetting = useMemo( () => {
		return settingsLoaded?.filter( ( data ) => data.id === 'api' )?.[ 0 ];
	}, [ settingsLoaded ] );

	useEffect( () => {
		if ( modules && apiSetting ) {
			setDataLoaded( true );
		}
	}, [ modules, apiSetting ] );

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
