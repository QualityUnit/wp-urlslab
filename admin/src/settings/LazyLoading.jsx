import { fetchSettings } from '../api/settings';
import { useState, useEffect } from 'react';
import Switch from '../elements/Switch';

export default function LazyLoading( { settingId } ) {
	const [ fetchedSettings, setSettings ] = useState();
	useEffect( () => {
		if ( ! fetchedSettings ) {
			fetchSettings( settingId ).then( ( settingsData ) => {
				if ( settingsData ) {
					setSettings( settingsData );
				}
			} );
		}
	}, [ fetchedSettings ] );

	console.log( fetchedSettings );

	return (
		<>
			<h2>Lazy loading</h2>
			<Switch />
		</>
	);
}
