import { lazy, Suspense, useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';

import { renameModule } from '../constants/helpers';
import ErrorBoundary from './ErrorBoundary';
import Loader from './Loader';
import '../assets/styles/layouts/_DynamicModule.scss';

let visitedModules = [];
export default function DynamicModule( { modules, moduleId } ) {
	const [ isVisited, setIsVisited ] = useState( false );

	const importPath = import( `../modules/${ renameModule( moduleId ) }.jsx` );
	const Module = lazy( () => importPath );

	// setIsVisited( visitedModules?.includes( moduleId ) );
	useEffect( () => {
		get( 'urlslab-visited' ).then( async ( response ) => {
			if ( ! await response ) {
				set( 'urlslab-visited', [] );
			}
			if ( await response ) {
				visitedModules = response;
				set( 'urlslab-visited', [ ...new Set( [ ...visitedModules, moduleId ] ) ] );
			}
		} );
	} );

	return (
		<div className="urlslab-DynamicModule">
			<ErrorBoundary>
				<Suspense fallback={ <Loader /> }>
					<div className="urlslab-DynamicModule-inn fadeInto">
						<Module modules={ modules } settingId="general" moduleId={ moduleId } isVisited={ isVisited } />
					</div>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
