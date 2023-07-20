import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getFetch, postFetch } from './api/fetching';
import { fetchLangs } from './api/fetchLangs';

import hexToHSL from './lib/hexToHSL';

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
	const queryClient = useQueryClient();
	const [ prefetch, setPrefetch ] = useState( true );

	useEffect( () => {
		if ( prefetch ) {
			// Creating languages query object in advance
			queryClient.prefetchQuery( {
				queryKey: [ 'languages' ],
				queryFn: async () => await fetchLangs(),
				refetchOnWindowFocus: false,
			} );

			/* Creating all endpoints query object in advance
			to check for allowed+required import/insert/edit CSV fields */
			queryClient.prefetchQuery( {
				queryKey: [ 'routes' ],
				queryFn: async () => {
					const response = await getFetch();
					if ( response.ok ) {
						return response.json();
					}
				},
				refetchOnWindowFocus: false,
			} );

			// Creating Tags/Labels query object in advance
			queryClient.prefetchQuery( {
				queryKey: [ 'label', 'menu' ],
				queryFn: async () => {
					const tags = await postFetch( 'label', { rows_per_page: 500 } );
					const tagsArray = await tags.json();
					tagsArray?.map( ( tag ) => {
						const { lightness } = hexToHSL( tag.bgcolor );
						if ( lightness < 70 ) {
							return tag.className = 'dark';
						}
						return tag;
					} );
					return tagsArray;
				},
				refetchOnWindowFocus: false,
			} );

			// Creating Tags/Labels query object in advance
			queryClient.prefetchQuery( {
				queryKey: [ 'label', 'modules' ],
				queryFn: async () => {
					const response = await getFetch( 'label/modules' );
					if ( response.ok ) {
						return response.json();
					}
				},
				refetchOnWindowFocus: false,
			} );

			setPrefetch( false );
		}
	}, [ prefetch, queryClient ] );

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
