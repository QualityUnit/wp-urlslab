import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeRoute } from '../../hooks/useOnloadRedirect';

// empty component to handle redirection to home route
// we do not show any content on 404 route
const Page404 = () => {
	const navigate = useNavigate();
	useEffect( () => {
		navigate( homeRoute );
	}, [ navigate ] );

	return null;
};

export default memo( Page404 );
