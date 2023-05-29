import { Suspense, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';

import useResizeObserver from '../hooks/useResizeObserver';
import useHeaderHeight from '../hooks/useHeaderHeight';

// eslint-disable-next-line import/no-extraneous-dependencies
import NoAPIkey from './NoAPIkey';
import CronRunner from './CronRunner';
import Credits from './Credits';
import Tag from '../elements/Tag';

import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';
import Button from '../elements/Button';

export default function Header( { pageTitle } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const headerTopHeight = useHeaderHeight( ( state ) => state.headerTopHeight );
	const setHeaderTopHeight = useHeaderHeight( ( state ) => state.setHeaderTopHeight );

	const handleHeaderHeight = useCallback( ( elem ) => {
		const headerHeight = elem?.getBoundingClientRect().height;
		if ( headerHeight && headerHeight !== headerTopHeight ) {
			setHeaderTopHeight( headerHeight );
		}
	}, [ headerTopHeight, setHeaderTopHeight ] );
	const headerTop = useResizeObserver( handleHeaderHeight );

	return (
		<Suspense>
			<header ref={ headerTop } className="urlslab-header">
				<div className="flex flex-align-center">
					<Logo className="urlslab-header-logo" />
					<Tag className="bg-saturated-orange c-white ml-s">beta</Tag>
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title ma-right">{ pageTitle }</h1>

					<Credits />

					<Button className="mr-m" active href="https://www.urlslab.com/dashboard/" target="_blank">{ __( 'Buy credits' ) }</Button>

					<CronRunner />

				</div>
				{ /* <NoAPIkey /> */ }
			</header>
		</Suspense>
	);
}
