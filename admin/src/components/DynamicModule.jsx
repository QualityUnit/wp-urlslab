import { lazy, Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Loader from './Loader';

export default function DynamicModule( { modules, moduleId } ) {
	/* Renames module id from ie urlslab-lazy-loading to LazyLoading
    Always capitalize first character in FileName.jsx after - when creating component/module !!!
    so urlslab-lazy-loading becomes LazyLoading.jsx component
  */
	const renameModule = () => {
		const name = moduleId.replace( 'urlslab', '' );
		return name.replace( /-(\w)/g, ( char ) => char.replace( '-', '' ).toUpperCase() );
	};

	const Module = lazy( () => import( `../modules/${ renameModule() }.jsx` ) );

	return (
		<div className="urlslab-module">
			<ErrorBoundary>
				<Suspense fallback={ <Loader /> }>
					<Module modules={ modules } moduleId={ moduleId } />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
