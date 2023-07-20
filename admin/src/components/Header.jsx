import { memo, Suspense, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useResizeObserver from '../hooks/useResizeObserver';
import useHeaderHeight from '../hooks/useHeaderHeight';
import useMainMenu from '../hooks/useMainMenu';

// eslint-disable-next-line import/no-extraneous-dependencies
import CronRunner from './CronRunner';
import Credits from './Credits';
import Tag from '../elements/Tag';

import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';
import Button from '../elements/Button';
import useModulesQuery from '../queries/useModulesQuery';

function Header() {
	const { __ } = useI18n();
	const { activePage } = useMainMenu();
	const headerTopHeight = useHeaderHeight( ( state ) => state.headerTopHeight );
	const setHeaderTopHeight = useHeaderHeight( ( state ) => state.setHeaderTopHeight );
	const { data: modules } = useModulesQuery();

	const handleHeaderHeight = useCallback( ( elem ) => {
		const headerHeight = elem?.getBoundingClientRect().height;
		if ( headerHeight && headerHeight !== headerTopHeight ) {
			setHeaderTopHeight( headerHeight );
		}
	}, [ headerTopHeight, setHeaderTopHeight ] );
	const headerTop = useResizeObserver( handleHeaderHeight );

	// we do not need use state with unnecessary rerender just to set title
	// header component rerenders when active page or fetched modules are changed
	let pageTitle = __( 'Modules' );
	switch ( activePage ) {
		case 'urlslab-modules':
			pageTitle = __( 'Modules' );
			break;
		case 'urlslab-settings':
			pageTitle = __( 'Settings' );
			break;
		case 'urlslab-schedule':
			pageTitle = __( 'Schedules' );
			break;
		case 'TagsLabels':
			pageTitle = __( 'Tags' );
			break;
		default:
			pageTitle = modules ? modules[ activePage ].title : '';
			break;
	}

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
