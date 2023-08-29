import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { CacheProvider } from '@emotion/react';

import { CssVarsProvider } from '@mui/joy/styles';
import ScopedCssBaseline from '@mui/joy/ScopedCssBaseline';

import useOnboarding from './hooks/useOnboarding';
import useCheckApiKey from './hooks/useCheckApiKey';
import useGeneralQuery from './queries/useGeneralQuery';
import { useModulesQueryPrefetch } from './queries/useModulesQuery';

import Notifications from './components/Notifications';
import Loader from './components/Loader';
import Onboarding from './onboarding/Onboarding';

import { router } from './app/router';

import { urlslabTheme } from './app/mui_joy/theme';
import { cache } from './app/mui_joy/cacheProvider';

import './assets/styles/style.scss';

const App = () => {
	const [ root, setRoot ] = useState( null );
	const { activeOnboarding } = useOnboarding( );
	const { isFetching, isSuccess } = useGeneralQuery();
	const { apiKeySet } = useCheckApiKey();

	useModulesQueryPrefetch();

	return (
		<CacheProvider value={ cache }>
			<CssVarsProvider theme={ urlslabTheme } colorSchemeNode={ root }>
				<ScopedCssBaseline ref={ ( element ) => setRoot( element ) }>
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
				</ScopedCssBaseline>
			</CssVarsProvider>
		</CacheProvider>
	);
};

export default App;
