/**
 * Hook to handle onload redirect to last opened page
 */

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { get, update } from 'idb-keyval';

const useOnloadRedirect = async () => {
	const [ checkedRedirection, setCheckedRedirection ] = useState( false );
	const location = useLocation();
	const navigate = useNavigate();

	if ( ! checkedRedirection ) {
		const lastActivePage = await get( 'lastActivePage' );

		// do not redirect, if is opened direct url with defined route
		const isRootRoute = location.pathname === '/';

		if ( lastActivePage && isRootRoute ) {
			navigate( lastActivePage );
		}
		setCheckedRedirection( true );
	}

	update( 'lastActivePage', () => {
		return location.pathname;
	} );
};

export default useOnloadRedirect;
