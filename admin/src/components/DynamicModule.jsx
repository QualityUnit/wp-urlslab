import { lazy, Suspense } from 'react';
import { renameModule } from '../constants/helpers';
import ErrorBoundary from './ErrorBoundary';
import Loader from './Loader';
import '../assets/styles/layouts/_DynamicModule.scss';

export default function DynamicModule( { modules, moduleId } ) {
	const importPath = import( `../modules/${ renameModule( moduleId ) }.jsx` );
	const Module = lazy( () => importPath );

	return (
		<div className="urlslab-DynamicModule">
			<ErrorBoundary>
				<Suspense fallback={ <Loader /> }>
					<div className="urlslab-DynamicModule-inn fadeInto">
						<Module modules={ modules } settingId="general" moduleId={ moduleId } />
					</div>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
