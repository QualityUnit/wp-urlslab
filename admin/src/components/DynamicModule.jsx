import { lazy, Suspense, useEffect, useState } from 'react';

import { renameModule } from '../lib/helpers';
import useHeaderHeight from '../hooks/useHeaderHeight';
import useMainMenu from '../hooks/useMainMenu';

import ErrorBoundary from './ErrorBoundary';
import Loader from './Loader';
import '../assets/styles/layouts/_DynamicModule.scss';

export default function DynamicModule() {
	const { activePage } = useMainMenu();
	const headerTopHeight = useHeaderHeight( ( state ) => state.headerTopHeight );
	const headerBottomHeight = useHeaderHeight( ( state ) => state.headerBottomHeight );

	const [ hasMounted, setHasMounted ] = useState( false );

	useEffect( () => {
		setHasMounted( true );
	}, [] );

	if ( ! hasMounted || ! activePage ) {
		return null;
	}

	const Module = lazy( () => import( `../modules/${ renameModule( activePage ) }.jsx` ) );

	return (
		<div className="urlslab-DynamicModule" style={ { '--headerTopHeight': `${ headerTopHeight }px`, '--headerMenuHeight': '52px', '--headerBottomHeight': `${ headerBottomHeight }px` } }
		>
			<ErrorBoundary>
				<Suspense fallback={ <Loader /> }>
					<div className="urlslab-DynamicModule-inn fadeInto">
						{ /* no need to pass modules to all dynamically loaded components, just Modules component uses fetched modules via props, we'll load it via query*/ }
						<Module
							settingId="general"
							moduleId={ activePage }
						/>
					</div>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
