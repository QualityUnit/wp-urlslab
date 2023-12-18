import { memo, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { CacheProvider } from '@emotion/react';

import { CssVarsProvider } from '@mui/joy/styles';
import ScopedCssBaseline from '@mui/joy/ScopedCssBaseline';

import useWpMenuWidth from './hooks/useWpMenuWidth';
import useUserInfo from './hooks/useUserInfo';
import useGeneralQuery from './queries/useGeneralQuery';
import useUserInfoQuery from './queries/useUserInfoQuery';
import { useModulesQueryPrefetch } from './queries/useModulesQuery';

import Notifications from './components/Notifications';
import Loader from './components/Loader';
import Onboarding from './onboarding/Onboarding';

import useRouter from './app/router';

import { urlslabTheme } from './app/mui_joy/theme';
import { cache } from './app/mui_joy/cacheProvider';

import './assets/styles/style.scss';

const useOnLoadQueries = () => {
	const { isLoading: isLoadingGeneral, isSuccess: isSuccessGeneral } = useGeneralQuery();
	const { isLoading: isLoadingUserInfo, isSuccess: isSuccessUserInfo } = useUserInfoQuery();

	return {
		isSuccess: isSuccessGeneral && isSuccessUserInfo,
		isLoading: isLoadingGeneral || isLoadingUserInfo,
	};
};

const App = () => {
	const [ root, setRoot ] = useState( null );
	const { isSuccess, isLoading } = useOnLoadQueries();
	const { userCompletedOnboarding } = useUserInfo();

	useModulesQueryPrefetch();
	useWpMenuWidth();

	return (
		<CacheProvider value={ cache }>
			<CssVarsProvider theme={ urlslabTheme } colorSchemeNode={ root }>
				<ScopedCssBaseline ref={ ( element ) => setRoot( element ) }>
					<div className="urlslab-app flex">
						{ ( isLoading ) && <Loader isFullscreen /> }
						{ ( isSuccess ) &&
						<>
							{ ( ! userCompletedOnboarding )
								? <Onboarding />
								: <RoutedWrapper />
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

const RoutedWrapper = memo( () => {
	const router = useRouter();
	return <RouterProvider router={ router } />;
} );

export default App;
