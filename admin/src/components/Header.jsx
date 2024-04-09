import { memo, Suspense, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import useResizeObserver from '../hooks/useResizeObserver';
import useHeaderHeight from '../hooks/useHeaderHeight';
import usePageTitle from '../hooks/usePageTitle';

import CronRunner from './CronRunner';
import Credits from './Credits';

import { ReactComponent as Logo } from '../assets/images/urlslab-logo.svg';

function Header() {
	const { __ } = useI18n();
	const pageTitle = usePageTitle();
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
					<span className="urlslab-header-slash">/</span>
					<h1 className="urlslab-header-title ma-right">{ pageTitle }</h1>

					<Credits />

					<Button
						component="a"
						href="https://www.urlslab.com/dashboard/"
						target="_blank"
						sx={ { mr: 1 } }
					>
						{ __( 'URLsLab dashboard', 'urlslab' ) }
					</Button>

					<CronRunner />

				</div>
				{ /* <NoAPIkey /> */ }
			</header>
		</Suspense>
	);
}

export default memo( Header );
