// import Switch from '../elements/Switch';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '@wordpress/react-i18n';
import { useState, useEffect } from 'react';
import { fetchData } from '../api/fetchData';

export default function LazyLoading( { moduleId } ) {
	const queryClient = useQueryClient();
	const { __ } = useI18n();

	const { data, status } = useQuery( {
		queryKey: [ 'tableYoutube', youtube ],
		queryFn: () => fetchData( 'youtube-cache' ),
	} );

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<></>
	);
}
