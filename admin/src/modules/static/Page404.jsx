import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useModuleGroups from '../../hooks/useModuleGroups';
import { homeRoute, homeTitle } from '../../hooks/useOnloadRedirect';

// empty component to handle redirection to home route
// we do not show any message on 404 page
const Page404 = () => {
	const navigate = useNavigate();
	const setActiveGroup = useModuleGroups( ( state ) => state.setActiveGroup );
	useEffect( () => {
		setActiveGroup( { key: homeRoute.replace( '/', '' ), group: homeTitle } );
		navigate( homeRoute );
	}, [ navigate, setActiveGroup ] );

	return null;
};

export default memo( Page404 );
