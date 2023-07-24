import { memo, Suspense, useCallback, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useResizeObserver from '../hooks/useResizeObserver';
import useHeaderHeight from '../hooks/useHeaderHeight';
import useMainMenu from '../hooks/useMainMenu';

// eslint-disable-next-line import/no-extraneous-dependencies
import NoAPIkey from './NoAPIkey';
import CronRunner from './CronRunner';
import Credits from './Credits';
import Tag from '../elements/Tag';

import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';
import Button from '../elements/Button';

function Header( { fetchedModules } ) {
	const { __ } = useI18n();
	const { activePage } = useMainMenu();
	const [ pageTitle, setTitle ] = useState( __( 'Modules' ) );
	const headerTopHeight = useHeaderHeight( ( state ) => state.headerTopHeight );
	const setHeaderTopHeight = useHeaderHeight( ( state ) => state.setHeaderTopHeight );

	const handleHeaderHeight = useCallback( ( elem ) => {
		const headerHeight = elem?.getBoundingClientRect().height;
		if ( headerHeight && headerHeight !== headerTopHeight ) {
			setHeaderTopHeight( headerHeight );
		}
	}, [ headerTopHeight, setHeaderTopHeight ] );
	const headerTop = useResizeObserver( handleHeaderHeight );

	useEffect( () => {
		if ( activePage && activePage === 'urlslab-modules' ) {
			setTitle( __( 'Modules' ) );
		}
		if ( activePage && activePage === 'urlslab-roles' ) {
			setTitle( __( 'Roles' ) );
		}
		if ( activePage && activePage === 'urlslab-settings' ) {
			setTitle( __( 'Settings' ) );
		}
		if ( activePage && activePage === 'urlslab-schedule' ) {
			setTitle( __( 'Schedules' ) );
		}
		if ( activePage && activePage === 'TagsLabels' ) {
			setTitle( __( 'Tags' ) );
		}
		if ( activePage && activePage !== 'urlslab-modules' && activePage !== 'urlslab-settings' && activePage !== 'urlslab-roles' && activePage !== 'urlslab-schedule' && activePage !== 'TagsLabels' ) {
			setTitle( fetchedModules[ activePage ].title );
		}
	}, [ __, activePage, fetchedModules, setTitle ] );

	return (
		<Suspense>
			<header ref={ headerTop } className="urlslab-header">
				<div className="flex flex-align-center">
					<Logo className="urlslab-header-logo" />
					<Tag className="bg-saturated-orange c-white ml-s">developer beta</Tag>
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

export default memo( Header );
