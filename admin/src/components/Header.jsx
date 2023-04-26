import { Suspense, useEffect, useContext, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { fetchData } from '../api/fetching';
import useResizeObserver from '../hooks/useResizeObserver';
import HeaderHeightContext from '../lib/headerHeightContext';

// eslint-disable-next-line import/no-extraneous-dependencies
import NoAPIkey from './NoAPIkey';
import Notifications from './Notifications';
import CronRunner from './CronRunner';
import Tag from '../elements/Tag';

import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';
import { useQueryClient } from '@tanstack/react-query';
import Button from '../elements/Button';

export default function Header( { pageTitle } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();

	const { headerTopHeight, setHeaderTopHeight } = useContext( HeaderHeightContext );

	const handleHeaderHeight = useCallback( ( elem ) => {
		const headerHeight = elem?.getBoundingClientRect().height;
		if ( headerHeight && headerHeight !== headerTopHeight ) {
			setHeaderTopHeight( headerHeight );
		}
	}, [ headerTopHeight, setHeaderTopHeight ] );
	const headerTop = useResizeObserver( handleHeaderHeight );

	useEffect( () => {
		async function getCredits() {
			return await queryClient.fetchQuery( {
				queryKey: [ 'credits' ],
				queryFn: async () => await fetchData( `billing/credits` ),
				refetchOnWindowFocus: false,
			} );
		}

		getCredits();
	}, [ ] );

	const credits = queryClient.getQueryData( [ 'credits' ] )?.credits;

	return (
		<Suspense>
			<header ref={ headerTop } className="urlslab-header">
				<div className="flex flex-align-center">
					<Logo className="urlslab-header-logo" />
					<Tag className="bg-saturated-orange c-white">beta</Tag>
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title ma-right">{ pageTitle }</h1>

					{
						credits &&
							<small className="fadeInto flex flex-align-center mr-m">
								{ __( 'Remaining credits: ' ) }
								<strong className="ml-s">{ credits }</strong>
							</small>
					}

					<Button className="mr-m" active href="https://www.urlslab.com/dashboard/credits/">{ __( 'Buy credits' ) }</Button>

					<CronRunner />

					{ /* <Notifications /> */ }
				</div>
				<NoAPIkey />
			</header>
		</Suspense>
	);
}
