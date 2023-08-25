import { RouterProvider } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';

import useOnboarding from './hooks/useOnboarding';
import useCheckApiKey from './hooks/useCheckApiKey';
import useGeneralQuery from './queries/useGeneralQuery';
import { useModulesQueryPrefetch } from './queries/useModulesQuery';

import Notifications from './components/Notifications';
import Loader from './components/Loader';
import Onboarding from './onboarding/Onboarding';
import { router } from './app/router';
import { urlslabTheme } from './app/theme';

import './assets/styles/style.scss';

const App = () => {
	const { activeOnboarding } = useOnboarding( );
	const { isFetching, isSuccess } = useGeneralQuery();
	const { apiKeySet } = useCheckApiKey();

	useModulesQueryPrefetch();

	return (
		<CssVarsProvider theme={ urlslabTheme }>
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
		</CssVarsProvider>
	);
};

export default App;
