// import Switch from '../elements/Switch';
import { useState, useEffect } from 'react';
import { fetchSettings } from '../api/settings';

export default function LazyLoading( { moduleId } ) {
	const [ settings, setSettings ] = useState();
	const handleOption = ( option ) => {
		console.log( option );
	};

	// useEffect( () => {
	if ( ! settings ) {
		fetchSettings( moduleId ).then( ( ModulesSettings ) => {
			if ( ModulesSettings ) {
				setSettings( ModulesSettings );
			}
		} );
	}
	// } );

	return (
		settings
			? ( settings.map( ( setting ) => {
				return setting.options.map( ( option ) => {
					return (
						<>
							<button onClick={ () => handleOption( option ) }>{ option.title }</button>
							<br />
						</>
					);
				} );
			} ) )
			: null
	);
}
