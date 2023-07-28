import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import useHeaderHeight from '../hooks/useHeaderHeight';
import useDisabledModuleRedirect from '../hooks/useDisabledModuleRedirect';
import useOnloadRedirect from '../hooks/useOnloadRedirect';

import ErrorBoundary from './ErrorBoundary';
import Loader from './Loader';

import '../assets/styles/layouts/_DynamicModule.scss';

const DynamicModule = () => {
	useOnloadRedirect();
	useDisabledModuleRedirect();

	const headerTopHeight = useHeaderHeight( ( state ) => state.headerTopHeight );
	const headerBottomHeight = useHeaderHeight( ( state ) => state.headerBottomHeight );

	return (
		<div className="urlslab-DynamicModule" style={ { '--headerTopHeight': `${ headerTopHeight }px`, '--headerMenuHeight': '52px', '--headerBottomHeight': `${ headerBottomHeight }px` } }>
			<ErrorBoundary>
				<Suspense fallback={ <Loader /> }>
					<div className="urlslab-DynamicModule-inn fadeInto">
						<Outlet />
					</div>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export default DynamicModule;
