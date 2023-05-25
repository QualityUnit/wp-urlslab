import { Suspense, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { postFetch } from '../api/fetching';
import useResizeObserver from '../hooks/useResizeObserver';
import HeaderHeightContext from '../lib/headerHeightContext';

// eslint-disable-next-line import/no-extraneous-dependencies
import NoAPIkey from './NoAPIkey';
import CronRunner from './CronRunner';
import Tag from '../elements/Tag';

import { ReactComponent as Loader } from '../assets/images/icons/icon-loading-input.svg';
import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';
import Button from '../elements/Button';

export default function Header( { pageTitle } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { headerTopHeight, setHeaderTopHeight } = useContext( HeaderHeightContext );
	const [ credits, setCredits ] = useState();

	const handleHeaderHeight = useCallback( ( elem ) => {
		const headerHeight = elem?.getBoundingClientRect().height;
		if ( headerHeight && headerHeight !== headerTopHeight ) {
			setHeaderTopHeight( headerHeight );
		}
	}, [ headerTopHeight, setHeaderTopHeight ] );
	const headerTop = useResizeObserver( handleHeaderHeight );

	const { data, isFetching } = useQuery( {
		queryKey: [ 'credits' ],
		queryFn: async () => {
			const result = await postFetch( `billing/credits`, { rows_per_page: 50 } );
			return result.json();
		},
		refetchOnWindowFocus: false,
		retry: 1,
		refetchInterval: 60 * 60 * 1000, // refresh every hour
	} );

	useEffect( () => {
		setCredits( () => data?.credits );
	}, [ data ] );

	return (
		<Suspense>
			<header ref={ headerTop } className="urlslab-header">
				<div className="flex flex-align-center">
					<Logo className="urlslab-header-logo" />
					<Tag className="bg-saturated-orange c-white ml-s">beta</Tag>
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title ma-right">{ pageTitle }</h1>

					{
						credits &&
							<small className="fadeInto flex flex-align-center mr-m">
								{ __( 'Remaining credits: ' ) }
								<strong className="ml-s">
									<button className={ `urlslab-header-credits no-margin no-padding` } onClick={ () => queryClient.invalidateQueries( [ 'credits' ] ) }>
										{ isFetching &&
											<Loader className="mr-xs" />
										}
										{ credits }
									</button>
								</strong>
							</small>
					}

					<Button className="mr-m" active href="https://www.urlslab.com/dashboard/" target="_blank">{ __( 'Buy credits' ) }</Button>

					<CronRunner />

					{ /* <Notifications /> */ }
				</div>
				<NoAPIkey />
			</header>
		</Suspense>
	);
}
