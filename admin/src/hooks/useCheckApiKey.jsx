import { useRef } from 'react';
import useStartupQuery from './useStartupQuery';

export default function useCheckApiKey() {
	const { data: settingsLoaded, isSuccess } = useStartupQuery();

	// api key undefined by default, we are waiting for loaded data
	const apiKeySet = useRef();
	if ( isSuccess && settingsLoaded ) {
		apiKeySet.current = checkForApiKey( settingsLoaded );
	}

	return { settingsLoaded, apiKeySet: apiKeySet.current };
}

const checkForApiKey = ( generalData ) => {
	const isApiObject = generalData.filter( ( dataset ) => dataset.id === 'api' )[ 0 ];
	const apiKeyValue = isApiObject.options[ 'urlslab-api-key' ].value;
	if ( apiKeyValue ) {
		return true;
	}
	return false;
};
