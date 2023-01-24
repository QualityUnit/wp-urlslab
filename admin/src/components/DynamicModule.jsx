import { lazy, Suspense, useState, useEffect } from 'react';
import { fetchSettings } from '../api/settings';
import ErrorBoundary from './ErrorBoundary';
import Loader from './Loader';

export default function DynamicModule( { moduleId } ) {
	const [ settings, setSettings ] = useState();

	useEffect( () => {
		if ( ! settings ) {
			fetchSettings( moduleId ).then( ( ModulesSettings ) => {
				if ( ModulesSettings ) {
					setSettings( ModulesSettings );
				}
			} );
		}
	}, [ settings, moduleId ] );

	/* Renames module id from ie urlslab-lazy-loading to LazyLoading
    Always capitalize first character in FileName.jsx after - when creating component/module !!!
    so urlslab-lazy-loading becomes LazyLoading.jsx component
  */
	const moduleName = ( ) => {
		const name = moduleId.replace( 'urlslab', '' );
		return name.replace( /-(\w)/g, ( char ) => char.replace( '-', '' ).toUpperCase() );
	};

	const Module = lazy( () => import( `../modules/${ moduleName( ) }.jsx` ) );
	// const Module = lazy( () => import( `../modules/LazyLoading` ) );

	return (
		<ErrorBoundary>
			<Suspense fallback={ <Loader /> }>
				{ Module
					? <Module settings={ settings } />
					: null
				}
			</Suspense>
		</ErrorBoundary>
	);
}
