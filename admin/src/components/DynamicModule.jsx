import { lazy, Suspense, useEffect, useState } from 'react';

import { renameModule } from '../lib/helpers';
import useHeaderHeight from '../hooks/useHeaderHeight';
import ErrorBoundary from './ErrorBoundary';
import Loader from './Loader';
import '../assets/styles/layouts/_DynamicModule.scss';

export default function DynamicModule( { modules, moduleId, activePage } ) {
	const importPath = import( `../modules/${ renameModule( moduleId ) }.jsx` );
	const Module = lazy( () => importPath );

	const headerTopHeight = useHeaderHeight( ( state ) => state.headerTopHeight );
	const headerBottomHeight = useHeaderHeight( ( state ) => state.headerBottomHeight );

	const [ hasMounted, setHasMounted ] = useState( false );

	useEffect( () => {
		setHasMounted( true );
	}, [] );

	if ( ! hasMounted ) {
		return null;
	}

	return (
		<div className="urlslab-DynamicModule" style={ { '--headerTopHeight': `${ headerTopHeight }px`, '--headerMenuHeight': '52px', '--headerBottomHeight': `${ headerBottomHeight }px` } }
		>
			<ErrorBoundary>
				<Suspense fallback={ <Loader /> }>
					<div className="urlslab-DynamicModule-inn fadeInto">
						<Module modules={ modules }
							activePage={ activePage }
							settingId="general"
							moduleId={ moduleId }
						/>
					</div>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
