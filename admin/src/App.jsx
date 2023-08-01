import { RouterProvider } from 'react-router-dom';

import useOnboarding from './hooks/useOnboarding';
import useCheckApiKey from './hooks/useCheckApiKey';
import useGeneralQuery from './queries/useGeneralQuery';
import { useModulesQueryPrefetch } from './queries/useModulesQuery';

import Notifications from './components/Notifications';
import Loader from './components/Loader';
import Onboarding from './onboarding/Onboarding';
import { router } from './app/router';

import './assets/styles/style.scss';

const App = () => {
	const { activeOnboarding } = useOnboarding( );
	const { isFetching, isSuccess } = useGeneralQuery();
	const { apiKeySet } = useCheckApiKey();

	useModulesQueryPrefetch();

	return (
		<div className="urlslab-app flex">
			{ isFetching && <Loader isFullscreen /> }
			{ isSuccess &&
				<>
					{ ( apiKeySet === false && activeOnboarding )
						? <Onboarding />
						: <RouterProvider router={ router } />
					}
					<Notifications />
				</>
			}
		</div>
	);
};

export default App;
