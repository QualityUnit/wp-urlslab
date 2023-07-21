import Notifications from './components/Notifications';
import MainMenu from './components/MainMenu';
import DynamicModule from './components/DynamicModule';
import Header from './components/Header';
import Loader from './components/Loader';
import Onboarding from './onboarding/Onboarding';

import useOnboarding from './hooks/useOnboarding';
import useCheckApiKey from './hooks/useCheckApiKey';
import useGeneralQuery from './queries/useGeneralQuery';
import { useModulesQueryPrefetch } from './queries/useModulesQuery';

import './assets/styles/style.scss';
import usePrefetchQueries from './queries/usePrefetchQueries';

export default function App() {
	const { activeOnboarding } = useOnboarding( );
	const { isFetching, isSuccess } = useGeneralQuery();
	const { apiKeySet } = useCheckApiKey();

	useModulesQueryPrefetch();

	return (
		<div className="urlslab-app flex">
			{ isFetching && <Loader /> }
			{ isSuccess &&
				<>
					{ ( apiKeySet === false && activeOnboarding )
						? <Onboarding />
						: <MainApp />
					}
					<Notifications />
				</>
			}
		</div>
	);
}

const MainApp = () => {
	usePrefetchQueries();

	return (
		<>
			<MainMenu />
			<div className="urlslab-app-main">
				<Header />
				<DynamicModule />
			</div>
		</>
	);
};
