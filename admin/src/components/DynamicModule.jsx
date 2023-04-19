import { lazy, Suspense, useContext } from 'react';

import { renameModule } from '../lib/helpers';
import HeaderHeightContext from '../lib/headerHeightContext';
import ErrorBoundary from './ErrorBoundary';
import Loader from './Loader';
import '../assets/styles/layouts/_DynamicModule.scss';

export default function DynamicModule( { modules, moduleId, activePage } ) {
	const importPath = import( `../modules/${ renameModule( moduleId ) }.jsx` );
	const Module = lazy( () => importPath );
	const { headerTopHeight, headerBottomHeight } = useContext( HeaderHeightContext );
	console.log( headerBottomHeight );

	return (
		<div className="urlslab-DynamicModule">
			<ErrorBoundary>
				<Suspense fallback={ <Loader /> }>
					<div className="urlslab-DynamicModule-inn fadeInto">
						<Module modules={ modules }
							activePage={ ( module ) => activePage( module ) }
							settingId="general"
							moduleId={ moduleId }
						/>
					</div>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
