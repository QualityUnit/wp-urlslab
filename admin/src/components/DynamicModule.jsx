import { lazy, Suspense } from 'react';
import { renameModule } from '../constants/helpers';
import ErrorBoundary from './ErrorBoundary';
import Loader from './Loader';
import '../assets/styles/layouts/_DynamicModule.scss';

export default function DynamicModule( { modules, moduleId, settingId, onChange } ) {
	const handleModuleValues = ( module, value ) => {
		if ( onChange ) {
			onChange( module, value );
		}
	};

	const Module = lazy( () => import( `../modules/${ renameModule( moduleId ) }.jsx` ) );

	return (
		<div className="urlslab-DynamicModule">
			<ErrorBoundary>
				<Suspense fallback={ <Loader /> }>
					<Module modules={ modules } settingId={ settingId } moduleId={ moduleId } onChange={ ( module, value ) => handleModuleValues( module, value ) } />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
