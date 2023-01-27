import { lazy, Suspense } from 'react';
import { renameModule } from '../constants/helpers';
import ErrorBoundary from '../components/ErrorBoundary';
import Loader from '../components/Loader';

export default function Settings( { settingId } ) {
	const SettingsModule = lazy( () => import( `../settings/${ renameModule( settingId ) }.jsx` ) );

	return (
		<div className="urlslab-SettingsModule">
			<ErrorBoundary>
				<Suspense fallback={ <Loader /> }>
					<SettingsModule settingId={ settingId } />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
}
