import { useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery } from '@tanstack/react-query';
import { fetchWPML } from '../api/fetchLangs';

import SortMenu from '../elements/SortMenu';

export default function LangMenu( { onChange, checkedId } ) {
	const { data, status } = useQuery( {
		queryKey: [ 'languages' ],
		queryFn: () => fetchWPML(),
	} );

	const langs = useMemo( () => {
		return data;
	}, [ data ] );

	if ( status === 'loading' ) {
		return <SortMenu />;
	}

	const handleSelected = ( lang ) => {
		if ( onChange ) {
			onChange( lang );
		}
	};

	return (
		<SortMenu
			items={ langs }
			name="languages"
			checkedId={ checkedId }
			onChange={ ( lang ) => handleSelected( lang ) }
		/>
	);
}
